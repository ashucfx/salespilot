package com.ripplenexus.salespilot.incentive.infrastructure;

import com.ripplenexus.salespilot.incentive.domain.EmployeeIncentive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeIncentiveRepository extends JpaRepository<EmployeeIncentive, UUID> {
    List<EmployeeIncentive> findByEmployeeIdAndDeletedAtIsNull(UUID employeeId);

    Optional<EmployeeIncentive> findByEmployeeIdAndIncentiveIdAndDeletedAtIsNull(UUID employeeId, UUID incentiveId);

    @Query("SELECT ei FROM EmployeeIncentive ei WHERE ei.status = 'CLAIMED' AND ei.deletedAt IS NULL")
    List<EmployeeIncentive> findAllClaimed();
}
