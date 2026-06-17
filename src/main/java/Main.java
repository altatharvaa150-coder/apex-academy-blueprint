import java.util.Scanner;
public class Main {
    public static void main(String[] args) throws Exception {
 System.out.print("$ ");
            String input = Scanner.nextLine();
            if (input.equals("exit")) {
                break;
            }
            System.out.println(input + ": command not found");
        }
    }       
    