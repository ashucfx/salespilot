package com.ripplenexus.salespilot.deal.infrastructure;

import com.ripplenexus.salespilot.deal.domain.Deal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Repository
public interface DealRepository extends JpaRepository<Deal, UUID> {

    Page<Deal> findByEmployeeIdAndDeletedAtIsNull(UUID employeeId, Pageable pageable);

    @Query("SELECT SUM(d.dealValue) FROM Deal d WHERE d.employee.id = :employeeId AND d.deletedAt IS NULL")
    BigDecimal sumRevenueByEmployee(UUID employeeId);

    @Query("SELECT SUM(d.dealValue) FROM Deal d WHERE d.deletedAt IS NULL AND d.closedAt >= :from AND d.closedAt <= :to")
    BigDecimal sumRevenueBetween(Instant from, Instant to);

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.employee.id = :employeeId AND d.deletedAt IS NULL")
    long countByEmployee(UUID employeeId);
}
