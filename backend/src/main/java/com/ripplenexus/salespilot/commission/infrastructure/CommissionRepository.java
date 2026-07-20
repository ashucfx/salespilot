package com.ripplenexus.salespilot.commission.infrastructure;

import com.ripplenexus.salespilot.commission.domain.Commission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, UUID> {


    Page<Commission> findByEmployeeId(UUID employeeId, Pageable pageable);

    Page<Commission> findByStatus(Commission.CommissionStatus status, Pageable pageable);

    @Query("SELECT c FROM Commission c WHERE c.employee.id = :employeeId AND c.status = :status")
    Page<Commission> findByEmployeeIdAndStatus(UUID employeeId, Commission.CommissionStatus status, Pageable pageable);

    @Query("SELECT SUM(c.commissionAmount) FROM Commission c WHERE c.employee.id = :employeeId AND c.status = 'PAID'")
    BigDecimal sumPaidByEmployee(UUID employeeId);

    @Query("SELECT SUM(c.commissionAmount) FROM Commission c WHERE c.employee.id = :employeeId AND c.status = 'PENDING'")
    BigDecimal sumPendingByEmployee(UUID employeeId);

    @Query("SELECT SUM(c.commissionAmount) FROM Commission c WHERE c.status = 'PENDING'")
    BigDecimal sumAllPending();

    boolean existsByDealId(UUID dealId);
}
