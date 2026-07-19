package com.ripplenexus.salespilot.deal.presentation.dto;

import com.ripplenexus.salespilot.deal.domain.Deal;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
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
        return DealDto.builder()
                .id(d.getId())
                .dealNumber(d.getDealNumber())
                .leadId(d.getLead() != null ? d.getLead().getId() : null)
                .leadNumber(d.getLead() != null ? d.getLead().getLeadNumber() : null)
                .contactName(d.getLead() != null ? d.getLead().getContactName() : null)
                .companyName(d.getLead() != null ? d.getLead().getCompanyName() : null)
                .employeeId(d.getEmployee() != null ? d.getEmployee().getId() : null)
                .employeeName(d.getEmployee() != null ? d.getEmployee().getFullName() : null)
                .dealValue(d.getDealValue())
                .currency(d.getCurrency())
                .invoiceNumber(d.getInvoiceNumber())
                .closedAt(d.getClosedAt())
                .notes(d.getNotes())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
