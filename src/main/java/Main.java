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
                    // Search PATH for the executable
                    String path = System.getenv("PATH");
                    String[] dirs = path.split(File.pathSeparator);
                    boolean found = false;

                    for (String dir : dirs) {
                        File file = new File(dir, arg);
                        if (file.exists() && file.canExecute()) {
                            System.out.println(arg + " is " + file.getAbsolutePath());
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        System.out.println(arg + ": not found");
                    }
                }

            } else {
                System.out.println(input + ": command not found");
            }
        }
    }
}