package com.ripplenexus.salespilot.deal.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.lead.domain.Lead;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "proposals")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Proposal extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private Employee createdBy;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "value", nullable = false, precision = 15, scale = 2)
    private BigDecimal value;

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "document_url")
    private String documentUrl;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProposalStatus status = ProposalStatus.DRAFT;

    @Column(name = "valid_until")
    private Instant validUntil;

    public enum ProposalStatus {
        DRAFT, SENT, VIEWED, ACCEPTED, REJECTED
    }
}
