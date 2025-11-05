package model;

public class Judge {
    private int judgeId;
    private int courtId;
    private String firstName;
    private String lastName;
    private String designation;
    private String email;
    private String doj; // Date of Joining

    public int getJudgeId() {
        return judgeId;
    }
    public void setJudgeId(int judgeId) {
        this.judgeId = judgeId;
    }

    public int getCourtId() {
        return courtId;
    }
    public void setCourtId(int courtId) {
        this.courtId = courtId;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDesignation() {
        return designation;
    }
    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getDoj() {
        return doj;
    }
    public void setDoj(String doj) {
        this.doj = doj;
    }
}
