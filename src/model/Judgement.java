package model;

import java.sql.Date;

public class Judgement {
    private int caseId;
    private int judgementId;
    private Date judgementDate;
    private String verdict;

    public int getCaseId() {
        return caseId;
    }
    public void setCaseId(int caseId) {
        this.caseId = caseId;
    }

    public int getJudgementId() {
        return judgementId;
    }
    public void setJudgementId(int judgementId) {
        this.judgementId = judgementId;
    }

    public Date getJudgementDate() {
        return judgementDate;
    }
    public void setJudgementDate(Date judgementDate) {
        this.judgementDate = judgementDate;
    }

    public String getVerdict() {
        return verdict;
    }
    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }
}
