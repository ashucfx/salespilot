import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestDB {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/salespilot", "salespilot", "salespilot123");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT email, password_hash, is_active, deleted_at FROM users");
        while (rs.next()) {
            System.out.println(rs.getString("email") + " | " + rs.getString("password_hash") + " | " + rs.getBoolean("is_active") + " | " + rs.getString("deleted_at"));
        }
        rs.close();
        stmt.close();
        conn.close();
    }
}
