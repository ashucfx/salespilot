package com.ripplenexus.salespilot.commission.presentation.dto;




import java.math.BigDecimal;
import java.util.UUID;

public class EmployeePayoutSummaryDto {
    private UUID employeeId;
    private String employeeName;
    private String employeeNumber;
    private BigDecimal totalPendingCommission;
    private long leadsGenerated;
    private long dealsClosed;
    private String nextPayoutDate;

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }
    public BigDecimal getTotalPendingCommission() { return totalPendingCommission; }
    public void setTotalPendingCommission(BigDecimal totalPendingCommission) { this.totalPendingCommission = totalPendingCommission; }
    public long getLeadsGenerated() { return leadsGenerated; }
    public void setLeadsGenerated(long leadsGenerated) { this.leadsGenerated = leadsGenerated; }
    public long getDealsClosed() { return dealsClosed; }
    public void setDealsClosed(long dealsClosed) { this.dealsClosed = dealsClosed; }
    public String getNextPayoutDate() { return nextPayoutDate; }
    public void setNextPayoutDate(String nextPayoutDate) { this.nextPayoutDate = nextPayoutDate; }
}
