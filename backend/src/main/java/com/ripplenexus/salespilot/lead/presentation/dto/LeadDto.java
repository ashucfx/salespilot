package com.ripplenexus.salespilot.lead.presentation.dto;

import com.ripplenexus.salespilot.lead.domain.Lead;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class LeadDto {
    private UUID id;
    private String leadNumber;
    private String contactName;
    private String contactDesignation;
    private String contactEmail;
    private String contactPhone;
    private String contactWhatsapp;
    private String contactLinkedin;
    private String companyName;
    private String companyWebsite;
    private String industry;
    private String country;
    private BigDecimal budget;
    private String currency;
    private String[] interestedServices;
    private String priority;
    private String sourceName;
    private UUID sourceId;
    private String assignedToName;
    private UUID assignedToId;
    private String status;
    private LocalDate expectedCloseDate;
    private Integer probability;
    private BigDecimal dealValue;
    private String notes;
    private int attachmentsCount;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;

    public static LeadDto from(Lead l) {
        return LeadDto.builder()
                .id(l.getId())
                .leadNumber(l.getLeadNumber())
                .contactName(l.getContactName())
                .contactDesignation(l.getContactDesignation())
                .contactEmail(l.getContactEmail())
                .contactPhone(l.getContactPhone())
                .contactWhatsapp(l.getContactWhatsapp())
                .contactLinkedin(l.getContactLinkedin())
                .companyName(l.getCompanyName())
                .companyWebsite(l.getCompanyWebsite())
                .industry(l.getIndustry())
                .country(l.getCountry())
                .budget(l.getBudget())
                .currency(l.getCurrency())
                .interestedServices(l.getInterestedServices())
                .priority(l.getPriority().name())
                .sourceName(l.getSource() != null ? l.getSource().getName() : null)
                .sourceId(l.getSource() != null ? l.getSource().getId() : null)
                .assignedToName(l.getAssignedTo() != null ? l.getAssignedTo().getFullName() : null)
                .assignedToId(l.getAssignedTo() != null ? l.getAssignedTo().getId() : null)
                .status(l.getStatus().name())
                .expectedCloseDate(l.getExpectedCloseDate())
                .probability(l.getProbability())
                .dealValue(l.getDealValue())
                .notes(l.getNotes())
                .attachmentsCount(l.getAttachments() != null ? l.getAttachments().size() : 0)
                .createdAt(l.getCreatedAt())
                .updatedAt(l.getUpdatedAt())
                .createdBy(l.getCreatedBy())
                .build();
    }
}
