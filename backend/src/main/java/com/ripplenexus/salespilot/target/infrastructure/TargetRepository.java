package com.ripplenexus.salespilot.target.infrastructure;

import com.ripplenexus.salespilot.target.domain.Target;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TargetRepository extends JpaRepository<Target, UUID> {

    @Query("SELECT t FROM Target t WHERE t.employee.id = :employeeId AND t.deletedAt IS NULL")
    List<Target> findByEmployeeId(UUID employeeId);

    @Query("""
        SELECT t FROM Target t
        WHERE t.employee.id = :employeeId
        AND t.type = 'REVENUE'
        AND t.periodStart <= :today
        AND t.periodEnd >= :today
        AND t.deletedAt IS NULL
        """)
    List<Target> findActiveRevenueTargets(UUID employeeId, LocalDate today);
}
