package model;

import java.time.LocalDate;

public class Hearing {
    private int hearingId;
    private int caseId;
    private LocalDate date;       // H_Date
    private LocalDate nextDate;   // Next_date
    private String report;        // Hearing_report

    // ===== Getters and Setters =====
    public int getHearingId() {
        return hearingId;
    }

    public void setHearingId(int hearingId) {
        this.hearingId = hearingId;
    }

    public int getCaseId() {
        return caseId;
    }

    public void setCaseId(int caseId) {
        this.caseId = caseId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDate getNextDate() {
        return nextDate;
    }

    public void setNextDate(LocalDate nextDate) {
        this.nextDate = nextDate;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }
}
