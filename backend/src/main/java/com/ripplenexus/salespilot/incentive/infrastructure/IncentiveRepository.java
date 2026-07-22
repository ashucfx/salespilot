package com.ripplenexus.salespilot.incentive.infrastructure;

import com.ripplenexus.salespilot.incentive.domain.Incentive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncentiveRepository extends JpaRepository<Incentive, UUID> {
    List<Incentive> findByStatusAndDeletedAtIsNull(Incentive.Status status);
}
