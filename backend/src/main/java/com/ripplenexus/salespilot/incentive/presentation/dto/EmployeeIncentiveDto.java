package com.ripplenexus.salespilot.incentive.presentation.dto;

import com.ripplenexus.salespilot.incentive.domain.EmployeeIncentive;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class EmployeeIncentiveDto {
    private UUID id;
    private UUID employeeId;
    private IncentiveDto incentive;
    private BigDecimal currentProgress;
    private BigDecimal targetValue;
    private double percentageComplete;
    private String status; // IN_PROGRESS, CLAIMABLE, CLAIMED
    private Instant claimedAt;

    public EmployeeIncentiveDto() {}

    public EmployeeIncentiveDto(UUID id, UUID employeeId, IncentiveDto incentive, BigDecimal currentProgress, BigDecimal targetValue, double percentageComplete, String status, Instant claimedAt) {
        this.id = id;
        this.employeeId = employeeId;
        this.incentive = incentive;
        this.currentProgress = currentProgress;
        this.targetValue = targetValue;
        this.percentageComplete = percentageComplete;
        this.status = status;
        this.claimedAt = claimedAt;
    }

    public static EmployeeIncentiveDto from(EmployeeIncentive ei) {
        BigDecimal target = ei.getIncentive().getTargetValue();
        BigDecimal progress = ei.getCurrentProgress() != null ? ei.getCurrentProgress() : BigDecimal.ZERO;
        
        double pct = 0.0;
        if (target != null && target.compareTo(BigDecimal.ZERO) > 0) {
            pct = progress.divide(target, 4, java.math.RoundingMode.HALF_UP).doubleValue() * 100.0;
            if (pct > 100.0) pct = 100.0;
        }

        return new EmployeeIncentiveDto(
                ei.getId(),
                ei.getEmployee().getId(),
                IncentiveDto.from(ei.getIncentive()),
                progress,
                target,
                Math.round(pct * 10.0) / 10.0,
                ei.getStatus() != null ? ei.getStatus().name() : null,
                ei.getClaimedAt()
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    public IncentiveDto getIncentive() { return incentive; }
    public void setIncentive(IncentiveDto incentive) { this.incentive = incentive; }
    public BigDecimal getCurrentProgress() { return currentProgress; }
    public void setCurrentProgress(BigDecimal currentProgress) { this.currentProgress = currentProgress; }
    public BigDecimal getTargetValue() { return targetValue; }
    public void setTargetValue(BigDecimal targetValue) { this.targetValue = targetValue; }
    public double getPercentageComplete() { return percentageComplete; }
    public void setPercentageComplete(double percentageComplete) { this.percentageComplete = percentageComplete; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getClaimedAt() { return claimedAt; }
    public void setClaimedAt(Instant claimedAt) { this.claimedAt = claimedAt; }
}
