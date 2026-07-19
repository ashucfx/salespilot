package com.ripplenexus.salespilot.commission.infrastructure;

import com.ripplenexus.salespilot.commission.domain.CommissionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommissionPlanRepository extends JpaRepository<com.ripplenexus.salespilot.commission.domain.EmployeeCommissionPlan, UUID> {

    @Query("""
        SELECT ecp.rule FROM EmployeeCommissionPlan ecp
        WHERE ecp.employee.id = :employeeId
        AND ecp.isActive = true
        AND ecp.effectiveFrom <= :date
        AND (ecp.effectiveTo IS NULL OR ecp.effectiveTo >= :date)
        ORDER BY ecp.effectiveFrom DESC
        """)
    Optional<CommissionRule> findActiveRuleByEmployee(UUID employeeId, LocalDate date);
}
