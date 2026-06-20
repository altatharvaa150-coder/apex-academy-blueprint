import java.util.Scanner;
import java.io.File;
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        List<String> builtins = Arrays.asList("echo", "exit", "type", "pwd");

        while (true) {
            System.out.print("$ ");
            if (!scanner.hasNextLine()) break;
            String input = scanner.nextLine().trim();
            if (input.isEmpty()) continue;

            String[] parts = input.split("\\s+");
            String command = parts[0];

            if (command.equals("exit")) {
                int code = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
                System.exit(code);
            } else if (command.equals("echo")) {
                StringBuilder sb = new StringBuilder();
                for (int i = 1; i < parts.length; i++) {
                    if (i > 1) sb.append(" ");
                    sb.append(parts[i]);
                }
                System.out.println(sb.toString());
            } else if (command.equals("pwd")) {
                System.out.println(System.getProperty("user.dir"));
            } else if (command.equals("type")) {
                if (parts.length < 2) continue;
                String target = parts[1];
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
                    ProcessBuilder pb = new ProcessBuilder(parts);
                    pb.inheritIO();
                    Process p = pb.start();
                    p.waitFor();
                } else {
                    System.out.println(command + ": command not found");
                }
            }
        }
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