package servlet;

import dao.DBConnection;
import model.Hearing;
import com.google.gson.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/hearings")
public class HearingServlet extends HttpServlet {

    // ✅ Create Gson with LocalDate support
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>) (date, type, jsonSerializationContext) ->
                    new JsonPrimitive(date != null ? date.toString() : null))
            .registerTypeAdapter(LocalDate.class, (JsonDeserializer<LocalDate>) (json, type, jsonDeserializationContext) ->
                    json != null ? LocalDate.parse(json.getAsString()) : null)
            .create();

    // -------------------- GET (Fetch all hearings) --------------------
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        List<Hearing> list = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT * FROM HEARINGS");
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Hearing h = new Hearing();
                h.setCaseId(rs.getInt("Case_id"));
                h.setHearingId(rs.getInt("Hearing_id"));

                Date hDate = rs.getDate("H_Date");
                Date nDate = rs.getDate("Next_date");

                h.setDate(hDate != null ? hDate.toLocalDate() : null);
                h.setNextDate(nDate != null ? nDate.toLocalDate() : null);
                h.setReport(rs.getString("Hearing_report"));

                list.add(h);
            }

        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
            return;
        }

        res.getWriter().write(gson.toJson(list));
    }

    // -------------------- POST (Insert new hearing) --------------------
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BufferedReader reader = req.getReader();
        Hearing h = gson.fromJson(reader, Hearing.class);

        String sql = "INSERT INTO HEARINGS (Case_id, Hearing_id, H_Date, Next_date, Hearing_report) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, h.getCaseId());
            ps.setInt(2, h.getHearingId());
            ps.setDate(3, h.getDate() != null ? Date.valueOf(h.getDate()) : null);
            ps.setDate(4, h.getNextDate() != null ? Date.valueOf(h.getNextDate()) : null);
            ps.setString(5, h.getReport());

            ps.executeUpdate();
            res.setStatus(201);
        } catch (java.sql.SQLIntegrityConstraintViolationException dupEx) {
            res.setStatus(409);
            res.getWriter().write("{\"error\":\"Duplicate entry for Case_id and Hearing_id. This hearing already exists.\"}");
        } catch (SQLException e) {
            res.setStatus(500);
            res.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // -------------------- PUT (Update hearing) --------------------
    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");
        BufferedReader reader = req.getReader();
        Hearing h = gson.fromJson(reader, Hearing.class);

        if (h.getHearingId() == 0) {
            res.setStatus(400);
            res.getWriter().write("{\"error\":\"Missing Hearing ID for update\"}");
            return;
        }

        String sql = "UPDATE HEARINGS SET Case_id=?, H_Date=?, Next_date=?, Hearing_report=? WHERE Hearing_id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

                ps.setInt(1, h.getCaseId());
                // Robust date parsing for date and nextDate
                try {
                    String dateStr = h.getDate() != null ? h.getDate().toString() : null;
                    java.sql.Date dateVal = null;
                    if (dateStr != null && !dateStr.isEmpty()) {
                        dateVal = java.sql.Date.valueOf(dateStr);
                    }
                    ps.setDate(2, dateVal);
                } catch (Exception ex) {
                    res.setStatus(400);
                    res.getWriter().write("{\"error\":\"Invalid hearing date format. Expected yyyy-MM-dd.\"}");
                    return;
                }
                try {
                    String nextDateStr = h.getNextDate() != null ? h.getNextDate().toString() : null;
                    java.sql.Date nextDateVal = null;
                    if (nextDateStr != null && !nextDateStr.isEmpty()) {
                        nextDateVal = java.sql.Date.valueOf(nextDateStr);
                    }
                    ps.setDate(3, nextDateVal);
                } catch (Exception ex) {
                    res.setStatus(400);
                    res.getWriter().write("{\"error\":\"Invalid nextDate format. Expected yyyy-MM-dd.\"}");
                    return;
                }
                ps.setString(4, h.getReport());
                ps.setInt(5, h.getHearingId());

            int rows = ps.executeUpdate();
            if (rows > 0)
                res.getWriter().write("{\"message\":\"Hearing updated successfully\"}");
            else
                res.sendError(404, "Hearing not found");

        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }

    // -------------------- DELETE (Delete hearing) --------------------
    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        int caseId = Integer.parseInt(req.getParameter("caseId"));
        int hearingId = Integer.parseInt(req.getParameter("hearingId"));

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(
                     "DELETE FROM HEARINGS WHERE Case_id=? AND Hearing_id=?")) {

            ps.setInt(1, caseId);
            ps.setInt(2, hearingId);
            ps.executeUpdate();
            res.setStatus(204);

        } catch (SQLException e) {
            res.sendError(500, e.getMessage());
        }
    }
}
