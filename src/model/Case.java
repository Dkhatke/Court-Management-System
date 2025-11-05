package model;
import java.sql.Date;
import java.time.LocalDate;
public class Case {
    private int caseId;
    private String caseTitle;
   private java.sql.Date filingDate;

    private int courtId;
    private int judgeId;

    public int getCaseId() {
        return caseId;
    }
    public void setCaseId(int caseId) {
        this.caseId = caseId;
    }

    public String getCaseTitle() {
        return caseTitle;
    }
    public void setCaseTitle(String caseTitle) {
        this.caseTitle = caseTitle;
    }

   public java.sql.Date getFilingDate() { return filingDate; }
public void setFilingDate(java.sql.Date filingDate) { this.filingDate = filingDate; }

  

    public int getCourtId() {
        return courtId;
    }
    public void setCourtId(int courtId) {
        this.courtId = courtId;
    }

    public int getJudgeId() {
        return judgeId;
    }
    public void setJudgeId(int judgeId) {
        this.judgeId = judgeId;
    }
}
