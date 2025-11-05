package servlet;

import dao.DBConnection;
import model.Court;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/courts")
public class CourtServlet extends HttpServlet {
    @Override
protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
    res.setContentType("application/json");
    BufferedReader reader = req.getReader();
    Court c = new Gson().fromJson(reader, Court.class);

    if (c.getCourtId() == 0) {
        res.setStatus(400);
        res.getWriter().write("{\"error\":\"Missing courtId for update\"}");
        return;
    }

    String sql = "UPDATE COURT SET Court_name=?, City=?, State=?, Type=? WHERE Court_id=?";
    try (Connection conn = DBConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setString(1, c.getCourtName());
        ps.setString(2, c.getCity());
        ps.setString(3, c.getState());
        ps.setString(4, c.getType());
        ps.setInt(5, c.getCourtId());

        int rows = ps.executeUpdate();
        if (rows > 0) {
            res.getWriter().write("{\"message\":\"Court updated successfully\"}");
        } else {
            res.setStatus(404);
            res.getWriter().write("{\"error\":\"Court not found\"}");
        }

    } catch (SQLException e) {
        res.setStatus(500);
        res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
    }
}

    // GET → Fetch all courts as JSON
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        List<Court> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM COURT");
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Court c = new Court();
                c.setCourtId(rs.getInt("Court_id"));
                c.setCourtName(rs.getString("Court_name"));
                c.setCity(rs.getString("City"));
                c.setState(rs.getString("State"));
                c.setType(rs.getString("Type"));
                list.add(c);
            }

        } catch (SQLException e) {
            res.setStatus(500);
            res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
            return;
        }

        res.getWriter().write(new Gson().toJson(list));
    }

    // POST → Insert new court
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        BufferedReader reader = req.getReader();
        Court c = new Gson().fromJson(reader, Court.class);

        String sql = "INSERT INTO COURT (Court_name, City, State, Type) VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, c.getCourtName());
            ps.setString(2, c.getCity());
            ps.setString(3, c.getState());
            ps.setString(4, c.getType());
            ps.executeUpdate();

            res.setStatus(201);
            res.getWriter().write("{\"message\":\"Court added successfully\"}");

        } catch (SQLException e) {
            res.setStatus(500);
            res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // DELETE → Delete court by ID
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        String idParam = req.getParameter("id");

        if (idParam == null) {
            res.setStatus(400);
            res.getWriter().write("{\"error\":\"Missing 'id' parameter\"}");
            return;
        }

        int id = Integer.parseInt(idParam);

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM COURT WHERE Court_id=?")) {

            ps.setInt(1, id);
            int rows = ps.executeUpdate();

            if (rows > 0) {
                res.getWriter().write("{\"message\":\"Court deleted successfully\"}");
            } else {
                res.setStatus(404);
                res.getWriter().write("{\"error\":\"Court not found\"}");
            }

        } catch (SQLException e) {
            res.setStatus(500);
            res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
