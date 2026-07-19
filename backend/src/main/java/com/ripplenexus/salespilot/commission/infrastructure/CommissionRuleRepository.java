package com.ripplenexus.salespilot.commission.infrastructure;

import com.ripplenexus.salespilot.commission.domain.CommissionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommissionRuleRepository extends JpaRepository<CommissionRule, UUID> {
    List<CommissionRule> findByIsActiveTrue();
    Optional<CommissionRule> findFirstByIsActiveTrueOrderByCreatedAtAsc();
}
