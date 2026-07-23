package com.ripplenexus.salespilot.employee.domain;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "employees")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "employee_number", nullable = false, unique = true)
    private String employeeNumber;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "personal_email")
    private String personalEmail;

    @Column(name = "work_email", nullable = false, unique = true)
    private String workEmail;

    @Column(name = "phone")
    private String phone;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "country")
    private String country;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "profile_picture")
    private String profilePicture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "designation")
    private String designation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private EmploymentStatus status = EmploymentStatus.ACTIVE;

    @Column(name = "salary", precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "bank_ifsc")
    private String bankIfsc;

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "national_id")
    private String nationalId;

    @Column(name = "country_of_id")
    private String countryOfId;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    @Builder.Default
    private KycStatus kycStatus = KycStatus.PENDING;

    @Column(name = "kyc_document_path")
    private String kycDocumentPath;

    @Column(name = "kyc_attempts", nullable = false)
    @Builder.Default
    private Integer kycAttempts = 0;

    @Column(name = "emergency_name")
    private String emergencyName;

    @Column(name = "emergency_phone")
    private String emergencyPhone;

    @Column(name = "emergency_rel")
    private String emergencyRelation;

    @Column(name = "performance_rating", precision = 3, scale = 1)
    private BigDecimal performanceRating;

    @Column(name = "notes")
    private String notes;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "employee_territories",
            joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "country")
    @org.hibernate.annotations.Fetch(org.hibernate.annotations.FetchMode.SUBSELECT)
    @Builder.Default
    private Set<String> territories = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "employee_industries",
            joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "industry")
    @org.hibernate.annotations.Fetch(org.hibernate.annotations.FetchMode.SUBSELECT)
    @Builder.Default
    private Set<String> industries = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "employee_services",
            joinColumns = @JoinColumn(name = "employee_id"))
    @Column(name = "service")
    @org.hibernate.annotations.Fetch(org.hibernate.annotations.FetchMode.SUBSELECT)
    @Builder.Default
    private Set<String> services = new HashSet<>();

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "resignation_status")
    private ResignationStatus resignationStatus;

    @Column(name = "resignation_reason")
    private String resignationReason;

    @Column(name = "resignation_submitted_at")
    private java.time.ZonedDateTime resignationSubmittedAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }

    public enum EmploymentStatus {
        ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, PROBATION
    }

    public enum KycStatus {
        PENDING, SUBMITTED, VERIFIED, REJECTED, CLARIFICATION_NEEDED, FROZEN
    }

    public enum ResignationStatus {
        SUBMITTED, APPROVED, REJECTED, WITHDRAWN
    }

    // Explicit Getters and Setters for guaranteed compilation
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPersonalEmail() { return personalEmail; }
    public void setPersonalEmail(String personalEmail) { this.personalEmail = personalEmail; }
    public String getWorkEmail() { return workEmail; }
    public void setWorkEmail(String workEmail) { this.workEmail = workEmail; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public Employee getManager() { return manager; }
    public void setManager(Employee manager) { this.manager = manager; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public EmploymentStatus getStatus() { return status; }
    public void setStatus(EmploymentStatus status) { this.status = status; }
    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankIfsc() { return bankIfsc; }
    public void setBankIfsc(String bankIfsc) { this.bankIfsc = bankIfsc; }
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }
    public String getCountryOfId() { return countryOfId; }
    public void setCountryOfId(String countryOfId) { this.countryOfId = countryOfId; }
    public KycStatus getKycStatus() { return kycStatus; }
    public void setKycStatus(KycStatus kycStatus) { this.kycStatus = kycStatus; }
    public String getKycDocumentPath() { return kycDocumentPath; }
    public void setKycDocumentPath(String kycDocumentPath) { this.kycDocumentPath = kycDocumentPath; }
    public Integer getKycAttempts() { return kycAttempts; }
    public void setKycAttempts(Integer kycAttempts) { this.kycAttempts = kycAttempts; }
    public String getEmergencyName() { return emergencyName; }
    public void setEmergencyName(String emergencyName) { this.emergencyName = emergencyName; }
    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }
    public String getEmergencyRelation() { return emergencyRelation; }
    public void setEmergencyRelation(String emergencyRelation) { this.emergencyRelation = emergencyRelation; }
    public BigDecimal getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(BigDecimal performanceRating) { this.performanceRating = performanceRating; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Set<String> getTerritories() { return territories; }
    public void setTerritories(Set<String> territories) { this.territories = territories; }
    public Set<String> getIndustries() { return industries; }
    public void setIndustries(Set<String> industries) { this.industries = industries; }
    public Set<String> getServices() { return services; }
    public void setServices(Set<String> services) { this.services = services; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public ResignationStatus getResignationStatus() { return resignationStatus; }
    public void setResignationStatus(ResignationStatus resignationStatus) { this.resignationStatus = resignationStatus; }
    public String getResignationReason() { return resignationReason; }
    public void setResignationReason(String resignationReason) { this.resignationReason = resignationReason; }
    public java.time.ZonedDateTime getResignationSubmittedAt() { return resignationSubmittedAt; }
    public void setResignationSubmittedAt(java.time.ZonedDateTime resignationSubmittedAt) { this.resignationSubmittedAt = resignationSubmittedAt; }
}
