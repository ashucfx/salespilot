package com.ripplenexus.salespilot.commission.presentation.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class EmployeePayoutSummaryDto {
    private UUID employeeId;
    private String employeeName;
    private String employeeNumber;
    private BigDecimal totalPendingCommission;
    private long leadsGenerated;
    private long dealsClosed;
    private String nextPayoutDate;
}
