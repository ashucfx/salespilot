package com.ripplenexus.salespilot.lead.infrastructure;

import com.ripplenexus.salespilot.lead.domain.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Page<Company> findByDeletedAtIsNull(Pageable pageable);
    boolean existsByNameIgnoreCase(String name);
}
