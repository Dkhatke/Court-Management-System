package servlet;

import dao.DBConnection;
import model.Judgement;
import com.google.gson.Gson;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/judgements")
public class JudgementServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        List<Judgement> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM JUDGEMENT");
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Judgement j = new Judgement();
                j.setCaseId(rs.getInt("Case_id"));
                j.setJudgementId(rs.getInt("Judgement_id"));
                j.setJudgementDate(rs.getDate("Judgement_date"));
                j.setVerdict(rs.getString("Verdict"));
                list.add(j);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        res.getWriter().write(new Gson().toJson(list));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BufferedReader reader = req.getReader();
        Judgement j = new Gson().fromJson(reader, Judgement.class);

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO JUDGEMENT (Case_id, Judgement_id, Judgement_date, Verdict) VALUES (?, ?, ?, ?)")) {

            ps.setInt(1, j.getCaseId());
            ps.setInt(2, j.getJudgementId());
            ps.setDate(3, j.getJudgementDate());
            ps.setString(4, j.getVerdict());
            ps.executeUpdate();
            res.setStatus(HttpServletResponse.SC_CREATED);

        } catch (SQLException e) {
            e.printStackTrace();
            res.sendError(500, e.getMessage());
        }
    }
    @Override
protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
    res.setContentType("application/json");
    BufferedReader reader = req.getReader();
    Judgement j = new Gson().fromJson(reader, Judgement.class);

    if (j.getJudgementId() == 0) {
        res.setStatus(400);
        res.getWriter().write("{\"error\":\"Missing Judgement ID for update\"}");
        return;
    }

    String sql = "UPDATE JUDGEMENT SET Case_id=?, Judgement_date=?, Verdict=? WHERE Judgement_id=?";
    try (Connection conn = DBConnection.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql)) {

        ps.setInt(1, j.getCaseId());
            // Robust date parsing for judgementDate
            try {
                java.sql.Date judgementDate = null;
                if (j.getJudgementDate() != null) {
                    String dateStr = j.getJudgementDate().toString();
                    if (!dateStr.isEmpty()) {
                        judgementDate = java.sql.Date.valueOf(dateStr);
                    }
                }
                ps.setDate(2, judgementDate);
            } catch (Exception ex) {
                res.setStatus(400);
                res.getWriter().write("{\"error\":\"Invalid judgementDate format. Expected yyyy-MM-dd.\"}");
                return;
            }
        ps.setString(3, j.getVerdict());
        ps.setInt(4, j.getJudgementId());

        int rows = ps.executeUpdate();
        if (rows > 0)
            res.getWriter().write("{\"message\":\"Judgement updated successfully\"}");
        else
            res.sendError(404, "Judgement not found");
    } catch (SQLException e) {
        res.sendError(500, e.getMessage());
    }
}

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int caseId = Integer.parseInt(req.getParameter("caseId"));
        int judgementId = Integer.parseInt(req.getParameter("judgementId"));

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                "DELETE FROM JUDGEMENT WHERE Case_id=? AND Judgement_id=?")) {

            ps.setInt(1, caseId);
            ps.setInt(2, judgementId);
            ps.executeUpdate();
            res.setStatus(HttpServletResponse.SC_NO_CONTENT);

        } catch (SQLException e) {
            e.printStackTrace();
            res.sendError(500, e.getMessage());
        }
    }
}
