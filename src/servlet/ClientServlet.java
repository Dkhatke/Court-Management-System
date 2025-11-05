package servlet;

import dao.DBConnection;
import model.Client;
import com.google.gson.Gson;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/clients")
public class ClientServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {

       
        res.setContentType("application/json");
        List<Client> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM CLIENT");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Client c = new Client();
                c.setClientId(rs.getInt("Client_id"));
                c.setClientName(rs.getString("Client_name"));
                c.setClientAddress(rs.getString("Client_address"));
                c.setClientEmail(rs.getString("Client_email"));
                list.add(c);
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
    Client c = new Gson().fromJson(reader, Client.class);

    if (c.getClientId() == 0) {
        res.setStatus(400);
        res.getWriter().write("{\"error\":\"Missing Client ID for update\"}");
        return;
    }

    String sql = "UPDATE CLIENT SET Client_name=?, Client_address=?, Client_email=? WHERE Client_id=?";
    try (Connection conn = DBConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setString(1, c.getClientName());
        ps.setString(2, c.getClientAddress());
        ps.setString(3, c.getClientEmail());
        ps.setInt(4, c.getClientId());

        int rows = ps.executeUpdate();
        if (rows > 0)
            res.getWriter().write("{\"message\":\"Client updated successfully\"}");
        else
            res.sendError(404, "Client not found");
    } catch (SQLException e) {
        res.sendError(500, e.getMessage());
    }
}

    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BufferedReader reader = req.getReader();
        Client c = new Gson().fromJson(reader, Client.class);
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("INSERT INTO CLIENT (Client_name, Client_address, Client_email) VALUES (?, ?, ?)")) {
            ps.setString(1, c.getClientName());
            ps.setString(2, c.getClientAddress());
            ps.setString(3, c.getClientEmail());
            ps.executeUpdate();
            res.setStatus(201);
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM CLIENT WHERE Client_id=?")) {
            ps.setInt(1, id);
            ps.executeUpdate();
            res.setStatus(204);
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }
}
