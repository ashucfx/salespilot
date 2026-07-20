import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("Demo@123 -> " + encoder.encode("Demo@123"));
        System.out.println("Admin@123 -> " + encoder.encode("Admin@123"));
        System.out.println("password -> " + encoder.encode("password"));
        
        System.out.println("Matches Admin@123? " + encoder.matches("Admin@123", "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi."));
        System.out.println("Matches password? " + encoder.matches("password", "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi."));
    }
}
