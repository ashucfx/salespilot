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

    public static EmployeeIncentiveDto from(EmployeeIncentive ei) {
        BigDecimal target = ei.getIncentive().getTargetValue();
        BigDecimal progress = ei.getCurrentProgress() != null ? ei.getCurrentProgress() : BigDecimal.ZERO;
        
        double pct = 0.0;
        if (target != null && target.compareTo(BigDecimal.ZERO) > 0) {
            pct = progress.divide(target, 4, java.math.RoundingMode.HALF_UP).doubleValue() * 100.0;
            if (pct > 100.0) pct = 100.0;
        }

        return EmployeeIncentiveDto.builder()
                .id(ei.getId())
                .employeeId(ei.getEmployee().getId())
                .incentive(IncentiveDto.from(ei.getIncentive()))
                .currentProgress(progress)
                .targetValue(target)
                .percentageComplete(Math.round(pct * 10.0) / 10.0)
                .status(ei.getStatus().name())
                .claimedAt(ei.getClaimedAt())
                .build();
    }
}
