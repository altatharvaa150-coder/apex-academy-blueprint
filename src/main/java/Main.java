import java.util.Scanner;
import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        List<String> builtins = Arrays.asList("echo", "exit", "type", "pwd", "cd");
        String cwd = System.getProperty("user.dir");

        while (true) {
            System.out.print("$ ");
            if (!scanner.hasNextLine()) break;
            String input = scanner.nextLine();
            if (input.trim().isEmpty()) continue;

            List<String> tokens = parseInput(input);
            if (tokens.isEmpty()) continue;

            String command = tokens.get(0);

            if (command.equals("exit")) {
                int code = tokens.size() > 1 ? Integer.parseInt(tokens.get(1)) : 0;
                System.exit(code);
            } else if (command.equals("echo")) {
                StringBuilder sb = new StringBuilder();
                for (int i = 1; i < tokens.size(); i++) {
                    if (i > 1) sb.append(" ");
                    sb.append(tokens.get(i));
                }
                System.out.println(sb.toString());
            } else if (command.equals("pwd")) {
                System.out.println(cwd);
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
            } else if (command.equals("type")) {
                if (tokens.size() < 2) continue;
                String target = tokens.get(1);
                if (builtins.contains(target)) {
                    System.out.println(target + " is a shell builtin");
                } else {
                    String path = findExecutable(target);
                    if (path != null) {
                        System.out.println(target + " is " + path);
                    } else {
                        System.out.println(target + ": not found");
                    }
                }
            } else {
                String path = findExecutable(command);
                if (path != null) {
                    ProcessBuilder pb = new ProcessBuilder(tokens);
                    pb.directory(new File(cwd));
                    pb.inheritIO();
                    Process p = pb.start();
                    p.waitFor();
                } else {
                    System.out.println(command + ": command not found");
                }
            }
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
                if (c == '"') {
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