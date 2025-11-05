package servlet;

import dao.DBConnection;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");

        BufferedReader reader = req.getReader();
        Map<String, String> data = new Gson().fromJson(reader, Map.class);
        String username = data.get("username");
        String password = data.get("password");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT role FROM USERS WHERE username=? AND password=?")) {

            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String role = rs.getString("role");

                // ✅ Create session
                HttpSession session = req.getSession();
                session.setAttribute("username", username);
                session.setAttribute("role", role);

                Map<String, String> resp = new HashMap<>();
                resp.put("status", "success");
                resp.put("role", role);

                res.getWriter().write(new Gson().toJson(resp));
            } else {
                res.setStatus(401);
                res.getWriter().write("{\"status\":\"error\", \"message\":\"Invalid credentials\"}");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(500);
            res.getWriter().write("{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
