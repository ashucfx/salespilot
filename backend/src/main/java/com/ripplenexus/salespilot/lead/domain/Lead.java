package com.ripplenexus.salespilot.lead.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import com.ripplenexus.salespilot.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leads")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead extends BaseEntity {

    @Column(name = "lead_number", nullable = false, unique = true)
    private String leadNumber;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_designation")
    private String contactDesignation;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_whatsapp")
    private String contactWhatsapp;

    @Column(name = "contact_linkedin")
    private String contactLinkedin;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_website")
    private String companyWebsite;

    @Column(name = "industry")
    private String industry;

    @Column(name = "country")
    private String country;

    @Column(name = "budget", precision = 15, scale = 2)
    private BigDecimal budget;

    @Column(name = "currency")
    private String currency = "INR";

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "interested_services", columnDefinition = "text[]")
    private String[] interestedServices;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private LeadPriority priority = LeadPriority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private LeadSource source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private Employee assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LeadStatus status = LeadStatus.NEW;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "probability")
    private Integer probability;

    @Column(name = "deal_value", precision = 15, scale = 2)
    private BigDecimal dealValue;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LeadAttachment> attachments = new ArrayList<>();

    public enum LeadStatus {
        NEW, CONTACTED, QUALIFIED, MEETING_SCHEDULED, DEMO,
        PROPOSAL_SENT, NEGOTIATION, WON, LOST, ON_HOLD
    }

    public enum LeadPriority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLeadNumber() { return leadNumber; }
    public void setLeadNumber(String leadNumber) { this.leadNumber = leadNumber; }
    public Employee getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Employee assignedTo) { this.assignedTo = assignedTo; }
    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }
}
