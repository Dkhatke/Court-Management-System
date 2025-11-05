package servlet;

import com.google.gson.Gson;
import dao.DBConnection;
import model.Case;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/cases")
public class CaseServlet extends HttpServlet {

    // -------------------- UPDATE (PUT) --------------------
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        BufferedReader reader = req.getReader();
        Case c = new Gson().fromJson(reader, Case.class);

        if (c.getCaseId() == 0) {
            res.setStatus(400);
            res.getWriter().write("{\"error\":\"Missing Case ID for update\"}");
            return;
        }

        String sql = "UPDATE CASES SET Case_title=?, Filing_date=?, Court_id=?, Judge_id=? WHERE Case_id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, c.getCaseTitle());
                // Robust date parsing for filingDate
                try {
                    String filingDateStr = c.getFilingDate() != null ? c.getFilingDate().toString() : null;
                    java.sql.Date filingDate = null;
                    if (filingDateStr != null && !filingDateStr.isEmpty()) {
                        filingDate = java.sql.Date.valueOf(filingDateStr);
                    }
                    ps.setDate(2, filingDate);
                } catch (Exception ex) {
                    res.setStatus(400);
                    res.getWriter().write("{\"error\":\"Invalid filingDate format. Expected yyyy-MM-dd.\"}");
                    return;
                }
            ps.setInt(3, c.getCourtId());
            ps.setInt(4, c.getJudgeId());
            ps.setInt(5, c.getCaseId());

            int rows = ps.executeUpdate();
            if (rows > 0)
                res.getWriter().write("{\"message\":\"Case updated successfully\"}");
            else
                res.sendError(404, "Case not found");
        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }

    // -------------------- GET (Fetch all cases) --------------------
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json; charset=UTF-8");
        List<Case> cases = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM CASES");
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Case c = new Case();
                c.setCaseId(rs.getInt("Case_id"));
                c.setCaseTitle(rs.getString("Case_title"));
                c.setFilingDate(rs.getDate("Filing_date")); // ✅ directly java.sql.Date
                c.setCourtId(rs.getInt("Court_id"));
                c.setJudgeId(rs.getInt("Judge_id"));
                cases.add(c);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        res.getWriter().write(new Gson().toJson(cases));
    }

    // -------------------- POST (Insert new case) --------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BufferedReader reader = req.getReader();
        Case c = new Gson().fromJson(reader, Case.class);

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                     "INSERT INTO CASES (Case_title, Filing_date, Court_id, Judge_id) VALUES (?, ?, ?, ?)")) {

            ps.setString(1, c.getCaseTitle());
            // ✅ Support both LocalDate or java.sql.Date
            ps.setDate(2, (c.getFilingDate() instanceof java.sql.Date)
                    ? (java.sql.Date) c.getFilingDate()
                    : java.sql.Date.valueOf(c.getFilingDate().toString()));
            ps.setInt(3, c.getCourtId());
            ps.setInt(4, c.getJudgeId());
            ps.executeUpdate();

            res.setStatus(HttpServletResponse.SC_CREATED);

        } catch (SQLException e) {
            e.printStackTrace();
            res.sendError(500, e.getMessage());
        }
    }

    // -------------------- DELETE (Remove case) --------------------
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("DELETE FROM CASES WHERE Case_id=?")) {

            ps.setInt(1, id);
            ps.executeUpdate();
            res.setStatus(HttpServletResponse.SC_NO_CONTENT);

        } catch (SQLException e) {
            e.printStackTrace();
            res.sendError(500, e.getMessage());
        }
    }
}
