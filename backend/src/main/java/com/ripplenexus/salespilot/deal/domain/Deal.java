package com.ripplenexus.salespilot.deal.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.lead.domain.Lead;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "deals")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Deal extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false, unique = true)
    private Lead lead;

    @Column(name = "deal_number", nullable = false, unique = true)
    private String dealNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "deal_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal dealValue;

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "closed_at", nullable = false)
    @Builder.Default
    private Instant closedAt = Instant.now();

    @Column(name = "notes")
    private String notes;
}
