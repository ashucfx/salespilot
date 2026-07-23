package com.ripplenexus.salespilot.incentive.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import com.ripplenexus.salespilot.employee.domain.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "employee_incentives")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeIncentive extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incentive_id", nullable = false)
    private Incentive incentive;

    @Column(name = "current_progress", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentProgress = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.IN_PROGRESS;

    @Column(name = "claimed_at")
    private Instant claimedAt;

    public enum ClaimStatus {
        IN_PROGRESS,
        CLAIMABLE,
        CLAIMED
    }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public Incentive getIncentive() { return incentive; }
    public void setIncentive(Incentive incentive) { this.incentive = incentive; }
    public BigDecimal getCurrentProgress() { return currentProgress; }
    public void setCurrentProgress(BigDecimal currentProgress) { this.currentProgress = currentProgress; }
    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
    public Instant getClaimedAt() { return claimedAt; }
    public void setClaimedAt(Instant claimedAt) { this.claimedAt = claimedAt; }
}
