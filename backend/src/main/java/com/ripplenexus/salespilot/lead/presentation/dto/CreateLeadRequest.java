package com.ripplenexus.salespilot.lead.presentation.dto;

import com.ripplenexus.salespilot.lead.domain.Lead;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateLeadRequest {

    @NotBlank(message = "Contact name is required")
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
    private String currency = "INR";
    private String[] interestedServices;
    private Lead.LeadPriority priority = Lead.LeadPriority.MEDIUM;
    private UUID sourceId;
    private UUID assignedToId;
    private LocalDate expectedCloseDate;
    private Integer probability;
    private String notes;
}
