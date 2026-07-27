package com.ripplenexus.salespilot.lead.infrastructure;

import com.ripplenexus.salespilot.lead.domain.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID> {

    Optional<Lead> findByLeadNumber(String leadNumber);

    // Employee data isolation — only assigned leads
    @Query("""
        SELECT l FROM Lead l
        WHERE l.deletedAt IS NULL
        AND l.assignedTo.id = :employeeId
        AND (
            CAST(:search AS string) IS NULL OR
            LOWER(l.contactName) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(l.companyName) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(l.contactEmail) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(l.leadNumber) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
        )
        AND (CAST(:status AS string) IS NULL OR CAST(l.status AS string) = CAST(:status AS string))
        AND (CAST(:priority AS string) IS NULL OR CAST(l.priority AS string) = CAST(:priority AS string))
        """)
    Page<Lead> findByAssignedToId(UUID employeeId, String search, String status,
                                   String priority, Pageable pageable);

    // Admin/Manager — all leads
    @Query("""
        SELECT l FROM Lead l
        WHERE l.deletedAt IS NULL
        AND (
            CAST(:search AS string) IS NULL OR
            LOWER(l.contactName) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(l.companyName) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(l.contactEmail) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(l.leadNumber) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
        )
        AND (CAST(:status AS string) IS NULL OR CAST(l.status AS string) = CAST(:status AS string))
        AND (CAST(:priority AS string) IS NULL OR CAST(l.priority AS string) = CAST(:priority AS string))
        AND (CAST(:assignedTo AS string) IS NULL OR CAST(l.assignedTo.id AS string) = CAST(:assignedTo AS string))
        """)
    Page<Lead> findAll(String search, String status, String priority,
                        UUID assignedTo, Pageable pageable);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.deletedAt IS NULL AND l.assignedTo.id = :employeeId")
    long countByAssignedTo(UUID employeeId);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.deletedAt IS NULL AND l.assignedTo.id = :employeeId AND l.status = 'WON'")
    long countWonByEmployee(UUID employeeId);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.deletedAt IS NULL AND l.assignedTo.id = :employeeId AND l.status NOT IN ('WON', 'LOST')")
    long countOpenByEmployee(UUID employeeId);

    @Query("SELECT l FROM Lead l WHERE l.deletedAt IS NULL AND l.expectedCloseDate <= :date AND l.status NOT IN ('WON', 'LOST')")
    List<Lead> findOverdueLeads(LocalDate date);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.deletedAt IS NULL AND l.status = :status")
    long countByStatus(Lead.LeadStatus status);
}
