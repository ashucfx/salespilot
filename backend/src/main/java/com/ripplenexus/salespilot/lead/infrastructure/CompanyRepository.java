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
    @org.springframework.data.jpa.repository.Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Company c WHERE LOWER(c.name) = LOWER(:name) AND c.deletedAt IS NULL")
    boolean existsByNameIgnoreCase(@org.springframework.data.repository.query.Param("name") String name);
}
