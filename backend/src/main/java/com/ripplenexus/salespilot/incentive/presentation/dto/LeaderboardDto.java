package com.ripplenexus.salespilot.incentive.presentation.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class LeaderboardDto {
    private int rank;
    private UUID employeeId;
    private String employeeName;
    private String employeeNumber;
    private String avatarUrl;
    private String designation;
    private BigDecimal totalRevenue;
    private long dealsClosed;
    private BigDecimal totalIncentivesEarned;
    private String salesTier; // Diamond, Platinum, Gold, Silver, Bronze
    private String badgeIcon;
}
