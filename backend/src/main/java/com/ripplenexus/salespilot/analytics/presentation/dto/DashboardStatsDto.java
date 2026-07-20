package com.ripplenexus.salespilot.analytics.presentation.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDto {
    private long totalLeads;
    private long openLeads;
    private long wonDeals;
    private BigDecimal totalRevenue;
    private long totalDeals;
    private BigDecimal paidCommission;
    private BigDecimal pendingCommission;
    private double conversionRate;
    
    // Admin stats
    private long totalEmployees;
    private long totalWon;
    private long totalLost;
    private BigDecimal monthlyRevenue;
    private BigDecimal pendingCommissions;
}
