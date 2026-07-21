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
            LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.workEmail) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.employeeNumber) LIKE LOWER(CONCAT('%', :search, '%'))
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
