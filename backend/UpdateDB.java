import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class UpdateDB {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/salespilot", "salespilot", "salespilot123");
        Statement stmt = conn.createStatement();
        String newHash = "$2b$12$/dmJonVPqNufjhN8nGgjPu4n2Ar7PTsdqSz3FFGS.RG3jd2x3OVPq"; // Admin@123
        int updated = stmt.executeUpdate("UPDATE users SET password_hash = '" + newHash + "' WHERE email = 'admin@salespilot.com'");
        System.out.println("Updated " + updated + " users.");
        stmt.close();
        conn.close();
    }
}
