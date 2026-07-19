package com.ripplenexus.salespilot.lead.infrastructure;

import com.ripplenexus.salespilot.lead.domain.IdealCustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ICPRepository extends JpaRepository<IdealCustomerProfile, UUID> {
    Page<IdealCustomerProfile> findByDeletedAtIsNull(Pageable pageable);
}
