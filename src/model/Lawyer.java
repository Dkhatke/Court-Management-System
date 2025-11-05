package model;

public class Lawyer {
    private int lawyerId;
    private String firstName;
    private String lastName;
    private String address;
    private String specialization;
    private String email;
    private int licenceNo;
    private String registrationYear;

    public int getLawyerId() {
        return lawyerId;
    }
    public void setLawyerId(int lawyerId) {
        this.lawyerId = lawyerId;
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

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getSpecialization() {
        return specialization;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public int getLicenceNo() {
        return licenceNo;
    }
    public void setLicenceNo(int licenceNo) {
        this.licenceNo = licenceNo;
    }

    public String getRegistrationYear() {
        return registrationYear;
    }
    public void setRegistrationYear(String registrationYear) {
        this.registrationYear = registrationYear;
    }
}
