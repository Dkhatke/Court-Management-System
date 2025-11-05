package model;

public class Court {
    private int courtId;
    private String courtName;
    private String city;
    private String state;
    private String type;

    // Getters and setters
    public int getCourtId() { return courtId; }
    public void setCourtId(int courtId) { this.courtId = courtId; }
    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
