package com.ripplenexus.salespilot.employee.infrastructure;

import com.ripplenexus.salespilot.employee.domain.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    Optional<Employee> findByUserId(UUID userId);

    Optional<Employee> findByWorkEmail(String workEmail);

    Optional<Employee> findByEmployeeNumber(String employeeNumber);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employee e WHERE e.workEmail = :workEmail AND e.deletedAt IS NULL")
    boolean existsByWorkEmail(String workEmail);

    @Query("""
        SELECT e FROM Employee e
        LEFT JOIN FETCH e.user u
        WHERE e.status = 'ACTIVE'
    """)
    Page<Employee> findAllActiveWithUser(Pageable pageable);

    @Query("""
        SELECT e FROM Employee e
        WHERE e.deletedAt IS NULL
        AND (
            CAST(:search AS string) IS NULL OR
            LOWER(e.firstName) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(e.lastName) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(e.workEmail) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
            OR LOWER(e.employeeNumber) LIKE CONCAT('%', LOWER(CAST(:search AS string)), '%')
        )
        """)
    Page<Employee> searchEmployees(String search, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.deletedAt IS NULL AND e.status = :status")
    Page<Employee> findByStatus(Employee.EmploymentStatus status, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.deletedAt IS NULL AND e.manager.id = :managerId")
    Page<Employee> findByManagerId(UUID managerId, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.deletedAt IS NULL AND e.status = 'ACTIVE'")
    long countActiveEmployees();

    @Query("SELECT e FROM Employee e WHERE e.deletedAt IS NULL ORDER BY e.createdAt DESC")
    Page<Employee> findAllActive(Pageable pageable);
}
