package com.ripplenexus.salespilot.employee.presentation.dto;

import com.ripplenexus.salespilot.employee.domain.Employee;



import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public class EmployeeDto {

    private UUID id;
    private UUID userId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String fullName;
    private String workEmail;
    private String personalEmail;
    private String phone;
    private String whatsapp;
    private String designation;
    private String department;
    private UUID departmentId;
    private String managerName;
    private UUID managerId;
    private LocalDate joiningDate;
    private String status;
    private String profilePicture;
    private String country;
    private String city;
    private BigDecimal performanceRating;
    private Set<String> territories;
    private Set<String> industries;
    private Set<String> services;
    private String notes;
    private String nationalId;
    private String countryOfId;
    private String upiId;
    private String bankName;
    private String bankAccount;
    private String bankIfsc;
    private String kycStatus;
    private LocalDate endDate;
    private LocalDate contractEndDate;

    public LocalDate getContractEndDate() { return contractEndDate; }
    public void setContractEndDate(LocalDate contractEndDate) { this.contractEndDate = contractEndDate; }
    private String resignationStatus;
    private String resignationReason;
    private Instant createdAt;
    private Instant updatedAt;

    public static EmployeeDto from(Employee e) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(e.getId());
        dto.setUserId(e.getUser() != null ? e.getUser().getId() : null);
        dto.setEmployeeNumber(e.getEmployeeNumber());
        dto.setFirstName(e.getFirstName());
        dto.setLastName(e.getLastName());
        dto.setFullName(e.getFullName());
        dto.setWorkEmail(e.getWorkEmail());
        dto.setPersonalEmail(e.getPersonalEmail());
        dto.setPhone(e.getPhone());
        dto.setWhatsapp(e.getWhatsapp());
        dto.setDesignation(e.getDesignation());
        dto.setDepartment(e.getDepartment() != null ? e.getDepartment().getName() : null);
        dto.setDepartmentId(e.getDepartment() != null ? e.getDepartment().getId() : null);
        dto.setManagerName(e.getManager() != null ? e.getManager().getFullName() : null);
        dto.setManagerId(e.getManager() != null ? e.getManager().getId() : null);
        dto.setJoiningDate(e.getJoiningDate());
        dto.setStatus(e.getStatus().name());
        dto.setProfilePicture(e.getProfilePicture());
        dto.setCountry(e.getCountry());
        dto.setCity(e.getCity());
        dto.setPerformanceRating(e.getPerformanceRating());
        try { dto.setTerritories(e.getTerritories() != null ? new java.util.HashSet<>(e.getTerritories()) : new java.util.HashSet<>()); } catch (Exception ex) { dto.setTerritories(new java.util.HashSet<>()); }
        try { dto.setIndustries(e.getIndustries() != null ? new java.util.HashSet<>(e.getIndustries()) : new java.util.HashSet<>()); } catch (Exception ex) { dto.setIndustries(new java.util.HashSet<>()); }
        try { dto.setServices(e.getServices() != null ? new java.util.HashSet<>(e.getServices()) : new java.util.HashSet<>()); } catch (Exception ex) { dto.setServices(new java.util.HashSet<>()); }
        dto.setNotes(e.getNotes());
        dto.setNationalId(e.getNationalId());
        dto.setCountryOfId(e.getCountryOfId());
        dto.setUpiId(e.getUpiId());
        dto.setBankName(e.getBankName());
        dto.setBankAccount(e.getBankAccount());
        dto.setBankIfsc(e.getBankIfsc());
        dto.setKycStatus(e.getKycStatus() != null ? e.getKycStatus().name() : null);
        dto.setEndDate(e.getEndDate());
        dto.setContractEndDate(e.getContractEndDate());
        dto.setResignationStatus(e.getResignationStatus() != null ? e.getResignationStatus().name() : null);
        dto.setResignationReason(e.getResignationReason());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getWorkEmail() { return workEmail; }
    public void setWorkEmail(String workEmail) { this.workEmail = workEmail; }
    public String getPersonalEmail() { return personalEmail; }
    public void setPersonalEmail(String personalEmail) { this.personalEmail = personalEmail; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String whatsapp) { this.whatsapp = whatsapp; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public UUID getDepartmentId() { return departmentId; }
    public void setDepartmentId(UUID departmentId) { this.departmentId = departmentId; }
    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }
    public UUID getManagerId() { return managerId; }
    public void setManagerId(UUID managerId) { this.managerId = managerId; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public BigDecimal getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(BigDecimal performanceRating) { this.performanceRating = performanceRating; }
    public Set<String> getTerritories() { return territories; }
    public void setTerritories(Set<String> territories) { this.territories = territories; }
    public Set<String> getIndustries() { return industries; }
    public void setIndustries(Set<String> industries) { this.industries = industries; }
    public Set<String> getServices() { return services; }
    public void setServices(Set<String> services) { this.services = services; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }
    public String getCountryOfId() { return countryOfId; }
    public void setCountryOfId(String countryOfId) { this.countryOfId = countryOfId; }
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankIfsc() { return bankIfsc; }
    public void setBankIfsc(String bankIfsc) { this.bankIfsc = bankIfsc; }
    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getResignationStatus() { return resignationStatus; }
    public void setResignationStatus(String resignationStatus) { this.resignationStatus = resignationStatus; }
    public String getResignationReason() { return resignationReason; }
    public void setResignationReason(String resignationReason) { this.resignationReason = resignationReason; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
