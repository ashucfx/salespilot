package com.ripplenexus.salespilot.lead.infrastructure;

import com.ripplenexus.salespilot.lead.domain.LeadSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeadSourceRepository extends JpaRepository<LeadSource, UUID> {
    List<LeadSource> findByIsActiveTrue();
}
