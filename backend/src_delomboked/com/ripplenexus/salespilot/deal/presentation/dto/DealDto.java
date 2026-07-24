package com.ripplenexus.salespilot.deal.presentation.dto;

import com.ripplenexus.salespilot.deal.domain.Deal;



import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class DealDto {
    private UUID id;
    private String dealNumber;
    private UUID leadId;
    private String leadNumber;
    private String contactName;
    private String companyName;
    private UUID employeeId;
    private String employeeName;
    private BigDecimal dealValue;
    private String currency;
    private String invoiceNumber;
    private Instant closedAt;
    private String notes;
    private Instant createdAt;

    public static DealDto from(Deal d) {
        DealDto dto = new DealDto();
        dto.setId(d.getId());
        dto.setDealNumber(d.getDealNumber());
        dto.setLeadId(d.getLead() != null ? d.getLead().getId() : null);
        dto.setLeadNumber(d.getLead() != null ? d.getLead().getLeadNumber() : null);
        dto.setContactName(d.getLead() != null ? d.getLead().getContactName() : null);
        dto.setCompanyName(d.getLead() != null ? d.getLead().getCompanyName() : null);
        dto.setEmployeeId(d.getEmployee() != null ? d.getEmployee().getId() : null);
        dto.setEmployeeName(d.getEmployee() != null ? d.getEmployee().getFullName() : null);
        dto.setDealValue(d.getDealValue());
        dto.setCurrency(d.getCurrency());
        dto.setInvoiceNumber(d.getInvoiceNumber());
        dto.setClosedAt(d.getClosedAt());
        dto.setNotes(d.getNotes());
        dto.setCreatedAt(d.getCreatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getDealNumber() { return dealNumber; }
    public void setDealNumber(String dealNumber) { this.dealNumber = dealNumber; }
    public UUID getLeadId() { return leadId; }
    public void setLeadId(UUID leadId) { this.leadId = leadId; }
    public String getLeadNumber() { return leadNumber; }
    public void setLeadNumber(String leadNumber) { this.leadNumber = leadNumber; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public BigDecimal getDealValue() { return dealValue; }
    public void setDealValue(BigDecimal dealValue) { this.dealValue = dealValue; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Instant getClosedAt() { return closedAt; }
    public void setClosedAt(Instant closedAt) { this.closedAt = closedAt; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}


