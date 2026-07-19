package com.ripplenexus.salespilot.activity.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.lead.domain.Lead;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "follow_ups")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowUp extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", nullable = false)
    private Employee assignedTo;

    @Column(name = "follow_up_date", nullable = false)
    private Instant followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FollowUpStatus status = FollowUpStatus.PENDING;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum FollowUpStatus {
        PENDING, COMPLETED, CANCELLED
    }
}
