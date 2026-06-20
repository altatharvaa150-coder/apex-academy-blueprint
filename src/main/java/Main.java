import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws Exception {
        enableRawMode();

        InputStream in = System.in;
        List<String> builtins = Arrays.asList("echo", "exit", "type", "pwd", "cd");
        List<String> completables = Arrays.asList("echo", "exit");
        String cwd = System.getProperty("user.dir");

        while (true) {
            System.out.print("$ ");
            System.out.flush();

            StringBuilder buf = new StringBuilder();
            while (true) {
                int ch = in.read();
                if (ch == -1) {
                    restoreMode();
                    return;
                }
                if (ch == '\n' || ch == '\r') {
                    System.out.print("\n");
                    System.out.flush();
                    break;
                } else if (ch == '\t') {
                    String prefix = buf.toString();
                    String match = null;
                    for (String b : completables) {
                        if (b.startsWith(prefix) && !b.equals(prefix)) {
                            match = b;
                            break;
                        }
                    }
                    if (match != null) {
                        String rest = match.substring(prefix.length()) + " ";
                        System.out.print(rest);
                        System.out.flush();
                        buf.append(rest);
                    } else {
                        System.out.print((char) 7);
                        System.out.flush();
                    }
                } else if (ch == 127 || ch == 8) {
                    if (buf.length() > 0) {
                        buf.deleteCharAt(buf.length() - 1);
                        System.out.print("\b \b");
                        System.out.flush();
                    }
                } else if (ch >= 32) {
                    buf.append((char) ch);
                    System.out.print((char) ch);
                    System.out.flush();
                }
            }

            String input = buf.toString();
            if (input.trim().isEmpty()) continue;

            List<String> rawTokens = parseInput(input);
            if (rawTokens.isEmpty()) continue;

            String stdoutFile = null;
            String stderrFile = null;
            boolean appendStdout = false;
            boolean appendStderr = false;
            List<String> tokens = new ArrayList<>();
            for (int i = 0; i < rawTokens.size(); i++) {
                String t = rawTokens.get(i);
                if ((t.equals(">") || t.equals("1>")) && i + 1 < rawTokens.size()) {
                    stdoutFile = rawTokens.get(i + 1);
                    appendStdout = false;
                    i++;
                } else if ((t.equals(">>") || t.equals("1>>")) && i + 1 < rawTokens.size()) {
                    stdoutFile = rawTokens.get(i + 1);
                    appendStdout = true;
                    i++;
                } else if (t.equals("2>") && i + 1 < rawTokens.size()) {
                    stderrFile = rawTokens.get(i + 1);
                    appendStderr = false;
                    i++;
                } else if (t.equals("2>>") && i + 1 < rawTokens.size()) {
                    stderrFile = rawTokens.get(i + 1);
                    appendStderr = true;
                    i++;
                } else {
                    tokens.add(t);
                }
            }
            if (tokens.isEmpty()) continue;

            String command = tokens.get(0);

            if (command.equals("exit")) {
                int code = tokens.size() > 1 ? Integer.parseInt(tokens.get(1)) : 0;
                restoreMode();
                System.exit(code);
            } else if (command.equals("cd")) {
                String target = tokens.size() < 2 ? "~" : tokens.get(1);
                if (target.equals("~")) {
                    String home = System.getenv("HOME");
                    if (home == null) home = System.getenv("USERPROFILE");
                    if (home != null) cwd = home;
                    continue;
                }
                File dir;
                if (target.startsWith("/")) {
                    dir = new File(target);
                } else {
                    dir = new File(cwd, target);
                }
                try {
                    File resolved = dir.getCanonicalFile();
                    if (resolved.isDirectory()) {
                        cwd = resolved.getAbsolutePath();
                    } else {
                        System.out.println("cd: " + target + ": No such file or directory");
                    }
                } catch (Exception e) {
                    System.out.println("cd: " + target + ": No such file or directory");
                }
            } else if (command.equals("echo") || command.equals("pwd") || command.equals("type")) {
                PrintStream out = System.out;
                PrintStream err = System.err;
                FileOutputStream fosOut = null;
                FileOutputStream fosErr = null;
                if (stdoutFile != null) {
                    File f = new File(stdoutFile);
                    File parent = f.getParentFile();
                    if (parent != null && !parent.exists()) parent.mkdirs();
                    fosOut = new FileOutputStream(f, appendStdout);
                    out = new PrintStream(fosOut);
                }
                if (stderrFile != null) {
                    File f = new File(stderrFile);
                    File parent = f.getParentFile();
                    if (parent != null && !parent.exists()) parent.mkdirs();
                    fosErr = new FileOutputStream(f, appendStderr);
                    err = new PrintStream(fosErr);
                }

                if (command.equals("echo")) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 1; i < tokens.size(); i++) {
                        if (i > 1) sb.append(" ");
                        sb.append(tokens.get(i));
                    }
                    out.println(sb.toString());
                } else if (command.equals("pwd")) {
                    out.println(cwd);
                } else {
                    if (tokens.size() >= 2) {
                        String target = tokens.get(1);
                        if (builtins.contains(target)) {
                            out.println(target + " is a shell builtin");
                        } else {
                            String path = findExecutable(target);
                            if (path != null) {
                                out.println(target + " is " + path);
                            } else {
                                out.println(target + ": not found");
                            }
                        }
                    }
                }

                if (fosOut != null) out.close();
                if (fosErr != null) err.close();
            } else {
                String path = findExecutable(command);
                if (path != null) {
                    ProcessBuilder pb = new ProcessBuilder(tokens);
                    pb.directory(new File(cwd));
                    pb.redirectInput(ProcessBuilder.Redirect.INHERIT);
                    if (stdoutFile != null) {
                        File f = new File(stdoutFile);
                        File parent = f.getParentFile();
                        if (parent != null && !parent.exists()) parent.mkdirs();
                        if (appendStdout) {
                            pb.redirectOutput(ProcessBuilder.Redirect.appendTo(f));
                        } else {
                            pb.redirectOutput(f);
                        }
                    } else {
                        pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
                    }
                    if (stderrFile != null) {
                        File f = new File(stderrFile);
                        File parent = f.getParentFile();
                        if (parent != null && !parent.exists()) parent.mkdirs();
                        if (appendStderr) {
                            pb.redirectError(ProcessBuilder.Redirect.appendTo(f));
                        } else {
                            pb.redirectError(f);
                        }
                    } else {
                        pb.redirectError(ProcessBuilder.Redirect.INHERIT);
                    }
                    Process p = pb.start();
                    p.waitFor();
                } else {
                    System.out.println(command + ": command not found");
                }
            }
        }
    }

    private static void enableRawMode() {
        try {
            String[] cmd = {"/bin/sh", "-c", "stty -icanon -echo min 1 < /dev/tty"};
            Runtime.getRuntime().exec(cmd).waitFor();
        } catch (Exception e) {
        }
    }

    private static void restoreMode() {
        try {
            String[] cmd = {"/bin/sh", "-c", "stty icanon echo < /dev/tty"};
            Runtime.getRuntime().exec(cmd).waitFor();
        } catch (Exception e) {
        }
    }

    private static List<String> parseInput(String input) {
        List<String> tokens = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inSingle = false;
        boolean inDouble = false;
        boolean hasToken = false;

        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            if (inSingle) {
                if (c == '\'') {
                    inSingle = false;
                } else {
                    current.append(c);
                }
            } else if (inDouble) {
                if (c == '\\' && i + 1 < input.length()) {
                    char next = input.charAt(i + 1);
                    if (next == '"' || next == '\\' || next == '$' || next == '`') {
                        current.append(next);
                        i++;
                    } else {
                        current.append(c);
                    }
                } else if (c == '"') {
                    inDouble = false;
                } else {
                    current.append(c);
                }
            } else {
                if (c == '\\') {
                    if (i + 1 < input.length()) {
                        current.append(input.charAt(i + 1));
                        i++;
                        hasToken = true;
                    }
                } else if (c == '\'') {
                    inSingle = true;
                    hasToken = true;
                } else if (c == '"') {
                    inDouble = true;
                    hasToken = true;
                } else if (c == '>') {
                    String cur = current.toString();
                    String prefix = "";
                    if (hasToken && (cur.equals("1") || cur.equals("2"))) {
                        prefix = cur;
                        current.setLength(0);
                        hasToken = false;
                    } else if (hasToken) {
                        tokens.add(cur);
                        current.setLength(0);
                        hasToken = false;
                    }
                    if (i + 1 < input.length() && input.charAt(i + 1) == '>') {
                        tokens.add(prefix + ">>");
                        i++;
                    } else {
                        tokens.add(prefix + ">");
                    }
                } else if (Character.isWhitespace(c)) {
                    if (hasToken) {
                        tokens.add(current.toString());
                        current.setLength(0);
                        hasToken = false;
                    }
                } else {
                    current.append(c);
                    hasToken = true;
                }
            }
        }
        if (hasToken) {
            tokens.add(current.toString());
        }
        return tokens;
    }

    private static String findExecutable(String name) {
        String pathEnv = System.getenv("PATH");
        if (pathEnv == null) return null;
        for (String dir : pathEnv.split(File.pathSeparator)) {
            File file = new File(dir, name);
            if (file.isFile() && file.canExecute()) {
                return file.getAbsolutePath();
            }
        }
        return null;
    }
}