package servlet;

import dao.DBConnection;
import model.Lawyer;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/lawyers")
public class LawyerServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        
        
        res.setContentType("application/json");
        List<Lawyer> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM LAWYER");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Lawyer l = new Lawyer();
                l.setLawyerId(rs.getInt("Lawyer_id"));
                l.setFirstName(rs.getString("L_firstName"));
                l.setLastName(rs.getString("L_lastName"));
                l.setAddress(rs.getString("L_address"));
                l.setSpecialization(rs.getString("Specialization"));
                l.setEmail(rs.getString("L_email"));
                list.add(l);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        res.getWriter().write(new Gson().toJson(list));
    }
    @Override
protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
    res.setContentType("application/json");
    BufferedReader reader = req.getReader();
    Lawyer l = new Gson().fromJson(reader, Lawyer.class);

    if (l.getLawyerId() == 0) {
        res.setStatus(400);
        res.getWriter().write("{\"error\":\"Missing Lawyer ID for update\"}");
        return;
    }

    String sql = "UPDATE LAWYER SET L_firstName=?, L_lastName=?, L_address=?, Specialization=?, L_email=?, Licence_no=?, RegistrationYear=? WHERE Lawyer_id=?";
    try (Connection conn = DBConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setString(1, l.getFirstName());
        ps.setString(2, l.getLastName());
        ps.setString(3, l.getAddress());
        ps.setString(4, l.getSpecialization());
        ps.setString(5, l.getEmail());
        ps.setInt(6, l.getLicenceNo());
            // Robust date parsing for registrationYear
            try {
                String regYearStr = l.getRegistrationYear();
                java.sql.Date regYearDate = null;
                if (regYearStr != null && !regYearStr.isEmpty()) {
                    regYearDate = java.sql.Date.valueOf(regYearStr);
                }
                ps.setDate(7, regYearDate);
            } catch (Exception ex) {
                res.setStatus(400);
                res.getWriter().write("{\"error\":\"Invalid registrationYear date format. Expected yyyy-MM-dd.\"}");
                return;
            }
        ps.setInt(8, l.getLawyerId());

        int rows = ps.executeUpdate();
        if (rows > 0)
            res.getWriter().write("{\"message\":\"Lawyer updated successfully\"}");
        else
            res.sendError(404, "Lawyer not found");
    } catch (SQLException e) {
        res.sendError(500, e.getMessage());
    }
}

    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BufferedReader reader = req.getReader();
        Lawyer l = new Gson().fromJson(reader, Lawyer.class);
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("INSERT INTO LAWYER (L_firstName, L_lastName, L_address, Specialization, L_email, Licence_no, RegistrationYear) VALUES (?, ?, ?, ?, ?, ?, ?)")) {
            ps.setString(1, l.getFirstName());
            ps.setString(2, l.getLastName());
            ps.setString(3, l.getAddress());
            ps.setString(4, l.getSpecialization());
            ps.setString(5, l.getEmail());
            ps.setInt(6, l.getLicenceNo());
            ps.setDate(7, java.sql.Date.valueOf(l.getRegistrationYear()));
            ps.executeUpdate();
            res.setStatus(201);
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM LAWYER WHERE Lawyer_id=?")) {
            ps.setInt(1, id);
            ps.executeUpdate();
            res.setStatus(204);
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }
}
