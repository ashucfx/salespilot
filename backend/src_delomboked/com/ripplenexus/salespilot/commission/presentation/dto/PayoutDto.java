package com.ripplenexus.salespilot.commission.presentation.dto;

import com.ripplenexus.salespilot.commission.domain.Payout;



import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

public class PayoutDto {
    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String employeeEmail;
    private BigDecimal amount;
    private BigDecimal baseSalary;
    private BigDecimal totalCommission;
    private String payoutPeriod;
    private LocalDate payoutDate;
    private String status;
    private String bankName;
    private String bankAccount;
    private String bankIfsc;
    private ZonedDateTime paidAt;
    private String paymentRef;
    private String notes;

    public static PayoutDto from(Payout p) {
        PayoutDto dto = new PayoutDto();
        dto.setId(p.getId());
        dto.setEmployeeId(p.getEmployee().getId());
        dto.setEmployeeName(p.getEmployee().getFullName());
        dto.setEmployeeEmail(p.getEmployee().getWorkEmail());
        dto.setAmount(p.getAmount());
        dto.setBaseSalary(p.getBaseSalary());
        dto.setTotalCommission(p.getTotalCommission());
        dto.setPayoutPeriod(p.getPayoutPeriod());
        dto.setPayoutDate(p.getPayoutDate());
        dto.setStatus(p.getStatus().name());
        dto.setBankName(p.getBankName());
        dto.setBankAccount(p.getBankAccount());
        dto.setBankIfsc(p.getBankIfsc());
        dto.setPaidAt(p.getPaidAt());
        dto.setPaymentRef(p.getPaymentRef());
        dto.setNotes(p.getNotes());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getEmployeeEmail() { return employeeEmail; }
    public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getBaseSalary() { return baseSalary; }
    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }
    public BigDecimal getTotalCommission() { return totalCommission; }
    public void setTotalCommission(BigDecimal totalCommission) { this.totalCommission = totalCommission; }
    public String getPayoutPeriod() { return payoutPeriod; }
    public void setPayoutPeriod(String payoutPeriod) { this.payoutPeriod = payoutPeriod; }
    public LocalDate getPayoutDate() { return payoutDate; }
    public void setPayoutDate(LocalDate payoutDate) { this.payoutDate = payoutDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankIfsc() { return bankIfsc; }
    public void setBankIfsc(String bankIfsc) { this.bankIfsc = bankIfsc; }
    public ZonedDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(ZonedDateTime paidAt) { this.paidAt = paidAt; }
    public String getPaymentRef() { return paymentRef; }
    public void setPaymentRef(String paymentRef) { this.paymentRef = paymentRef; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
