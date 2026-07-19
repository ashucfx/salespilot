package com.ripplenexus.salespilot.analytics.application;

import com.ripplenexus.salespilot.commission.infrastructure.CommissionRepository;
import com.ripplenexus.salespilot.deal.infrastructure.DealRepository;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final LeadRepository leadRepository;
    private final DealRepository dealRepository;
    private final EmployeeRepository employeeRepository;
    private final CommissionRepository commissionRepository;

    /**
     * Employee dashboard stats
     */
    public Map<String, Object> getEmployeeDashboard(UUID employeeId) {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalLeads", leadRepository.countByAssignedTo(employeeId));
        stats.put("openLeads", leadRepository.countOpenByEmployee(employeeId));
        stats.put("wonDeals", leadRepository.countWonByEmployee(employeeId));
        stats.put("totalRevenue", dealRepository.sumRevenueByEmployee(employeeId));
        stats.put("totalDeals", dealRepository.countByEmployee(employeeId));

        BigDecimal paidCommission = commissionRepository.sumPaidByEmployee(employeeId);
        BigDecimal pendingCommission = commissionRepository.sumPendingByEmployee(employeeId);
        stats.put("paidCommission", paidCommission != null ? paidCommission : BigDecimal.ZERO);
        stats.put("pendingCommission", pendingCommission != null ? pendingCommission : BigDecimal.ZERO);

        // Conversion rate
        long total = leadRepository.countByAssignedTo(employeeId);
        long won = leadRepository.countWonByEmployee(employeeId);
        double conversionRate = total > 0 ? (double) won / total * 100 : 0;
        stats.put("conversionRate", Math.round(conversionRate * 10.0) / 10.0);

        return stats;
    }

    /**
     * Admin dashboard stats
     */
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalEmployees", employeeRepository.countActiveEmployees());
        stats.put("totalLeads", leadRepository.countByStatus(Lead.LeadStatus.NEW)
                + leadRepository.countByStatus(Lead.LeadStatus.CONTACTED));
        stats.put("totalWon", leadRepository.countByStatus(Lead.LeadStatus.WON));
        stats.put("totalLost", leadRepository.countByStatus(Lead.LeadStatus.LOST));

        // Monthly revenue
        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        Instant monthStart = firstOfMonth.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant monthEnd = Instant.now();
        BigDecimal monthlyRevenue = dealRepository.sumRevenueBetween(monthStart, monthEnd);
        stats.put("monthlyRevenue", monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO);

        BigDecimal pendingCommissions = commissionRepository.sumAllPending();
        stats.put("pendingCommissions", pendingCommissions != null ? pendingCommissions : BigDecimal.ZERO);

        return stats;
    }
}
