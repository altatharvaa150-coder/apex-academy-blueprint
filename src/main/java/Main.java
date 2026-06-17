import java.util.Scanner;
import java.util.Set;
import java.io.File;

public class Main {
    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);
        Set<String> builtins = Set.of("echo", "exit", "type");

        while (true) {
            System.out.print("$ ");
            String input = scanner.nextLine();

            String[] parts = input.split(" ", 2);
            String command = parts[0];

            if (command.equals("exit")) {
                break;

            } else if (command.equals("echo")) {
                if (parts.length > 1) {
                    System.out.println(parts[1]);
                } else {
                    System.out.println();
                }

            } else if (command.equals("type")) {
                String arg = parts.length > 1 ? parts[1] : "";

                if (builtins.contains(arg)) {
                    System.out.println(arg + " is a shell builtin");
                } else {
                    String fullPath = findExecutable(arg);
                    if (fullPath != null) {
                        System.out.println(arg + " is " + fullPath);
                    } else {
                        System.out.println(arg + ": not found");
                    }
                }

            } else {
                String fullPath = findExecutable(command);
                if (fullPath != null) {
                    String[] allArgs = input.split(" ");
                    ProcessBuilder pb = new ProcessBuilder(allArgs);
                    pb.inheritIO();
                    Process process = pb.start();
                    process.waitFor();
                } else {
                    System.out.println(input + ": command not found");
                }
            }
        }
    }

    private static String findExecutable(String command) {
        String path = System.getenv("PATH");
        String[] dirs = path.split(File.pathSeparator);

        for (String dir : dirs) {
            File file = new File(dir, command);
            if (file.exists() && file.canExecute()) {
                return file.getAbsolutePath();
            }
        }
        return null;
    }
}