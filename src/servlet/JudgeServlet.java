package servlet;

import dao.DBConnection;
import model.Judge;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/judges")
public class JudgeServlet extends HttpServlet {
    @Override
protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
    res.setContentType("application/json");
    BufferedReader reader = req.getReader();
    Judge j = new Gson().fromJson(reader, Judge.class);

    if (j.getJudgeId() == 0) {
        res.setStatus(400);
        res.getWriter().write("{\"error\":\"Missing Judge ID for update\"}");
        return;
    }

    String sql = "UPDATE JUDGE SET Court_id=?, J_firstName=?, J_lastName=?, Designation=?, J_email=?, DOJ=? WHERE Judge_id=?";
    try (Connection conn = DBConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setInt(1, j.getCourtId());
        ps.setString(2, j.getFirstName());
        ps.setString(3, j.getLastName());
        ps.setString(4, j.getDesignation());
        ps.setString(5, j.getEmail());
        ps.setDate(6, java.sql.Date.valueOf(j.getDoj()));
        ps.setInt(7, j.getJudgeId());

        int rows = ps.executeUpdate();
        if (rows > 0)
            res.getWriter().write("{\"message\":\"Judge updated successfully\"}");
        else
            res.sendError(404, "Judge not found");
    } catch (SQLException e) {
        res.sendError(500, e.getMessage());
    }
}

    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {

        
        res.setContentType("application/json");
        List<Judge> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM JUDGE");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Judge j = new Judge();
                j.setJudgeId(rs.getInt("Judge_id"));
                j.setCourtId(rs.getInt("Court_id"));
                j.setFirstName(rs.getString("J_firstName"));
                j.setLastName(rs.getString("J_lastName"));
                j.setDesignation(rs.getString("Designation"));
                j.setEmail(rs.getString("J_email"));
                list.add(j);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        res.getWriter().write(new Gson().toJson(list));
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BufferedReader reader = req.getReader();
        Judge j = new Gson().fromJson(reader, Judge.class);
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("INSERT INTO JUDGE (Court_id, J_firstName, J_lastName, Designation, J_email, DOJ) VALUES (?, ?, ?, ?, ?, ?)")) {
            ps.setInt(1, j.getCourtId());
            ps.setString(2, j.getFirstName());
            ps.setString(3, j.getLastName());
            ps.setString(4, j.getDesignation());
            ps.setString(5, j.getEmail());
            ps.setDate(6, java.sql.Date.valueOf(j.getDoj()));
            ps.executeUpdate();
            res.setStatus(201);
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM JUDGE WHERE Judge_id=?")) {
            ps.setInt(1, id);
            ps.executeUpdate();
            res.setStatus(204);
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }
}
