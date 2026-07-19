package com.ripplenexus.salespilot.employee.application;

import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.auth.infrastructure.RoleRepository;
import com.ripplenexus.salespilot.auth.infrastructure.UserRepository;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.DuplicateResourceException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.employee.domain.Department;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.DepartmentRepository;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.employee.presentation.dto.CreateEmployeeRequest;
import com.ripplenexus.salespilot.employee.presentation.dto.EmployeeDto;
import com.ripplenexus.salespilot.employee.presentation.dto.UpdateEmployeeRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.YearMonth;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    public EmployeeDto createEmployee(CreateEmployeeRequest request) {
        if (userRepository.existsByEmail(request.getWorkEmail())) {
            throw new DuplicateResourceException("An employee with email " + request.getWorkEmail() + " already exists.");
        }

        // Generate temporary password
        String tempPassword = generateTempPassword();

        // Create user account
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role", request.getRole()));

        User user = User.builder()
                .email(request.getWorkEmail())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .isActive(true)
                .isEmailVerified(false)
                .roles(Set.of(role))
                .build();
        userRepository.save(user);

        // Build employee
        Employee.EmployeeBuilder builder = Employee.builder()
                .user(user)
                .employeeNumber(generateEmployeeNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .workEmail(request.getWorkEmail())
                .personalEmail(request.getPersonalEmail())
                .phone(request.getPhone())
                .whatsapp(request.getWhatsapp())
                .designation(request.getDesignation())
                .joiningDate(request.getJoiningDate())
                .status(Employee.EmploymentStatus.ACTIVE)
                .salary(request.getSalary())
                .notes(request.getNotes());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));
            builder.department(dept);
        }

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", request.getManagerId()));
            builder.manager(manager);
        }

        Employee employee = builder.build();
        employee = employeeRepository.save(employee);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(request.getWorkEmail(),
                request.getFirstName(), tempPassword);

        log.info("Employee created: {} ({})", employee.getFullName(), employee.getEmployeeNumber());
        return EmployeeDto.from(employee);
    }

    public EmployeeDto updateEmployee(UUID id, UpdateEmployeeRequest request) {
        Employee employee = getEmployeeOrThrow(id);

        if (request.getFirstName() != null) employee.setFirstName(request.getFirstName());
        if (request.getLastName() != null) employee.setLastName(request.getLastName());
        if (request.getPhone() != null) employee.setPhone(request.getPhone());
        if (request.getWhatsapp() != null) employee.setWhatsapp(request.getWhatsapp());
        if (request.getDesignation() != null) employee.setDesignation(request.getDesignation());
        if (request.getAddress() != null) employee.setAddress(request.getAddress());
        if (request.getCity() != null) employee.setCity(request.getCity());
        if (request.getState() != null) employee.setState(request.getState());
        if (request.getCountry() != null) employee.setCountry(request.getCountry());
        if (request.getNotes() != null) employee.setNotes(request.getNotes());
        if (request.getStatus() != null) employee.setStatus(request.getStatus());
        if (request.getSalary() != null) employee.setSalary(request.getSalary());
        if (request.getPerformanceRating() != null) employee.setPerformanceRating(request.getPerformanceRating());
        if (request.getTerritories() != null) employee.setTerritories(request.getTerritories());
        if (request.getIndustries() != null) employee.setIndustries(request.getIndustries());
        if (request.getServices() != null) employee.setServices(request.getServices());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", request.getDepartmentId()));
            employee.setDepartment(dept);
        }

        if (request.getManagerId() != null) {
            if (request.getManagerId().equals(id)) {
                throw new BusinessException("An employee cannot be their own manager.");
            }
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", request.getManagerId()));
            employee.setManager(manager);
        }

        return EmployeeDto.from(employeeRepository.save(employee));
    }

    public void deactivateEmployee(UUID id) {
        Employee employee = getEmployeeOrThrow(id);
        employee.setStatus(Employee.EmploymentStatus.INACTIVE);
        employee.getUser().setActive(false);
        employeeRepository.save(employee);
        log.info("Employee deactivated: {}", employee.getEmployeeNumber());
    }

    public void deleteEmployee(UUID id) {
        Employee employee = getEmployeeOrThrow(id);
        employee.softDelete();
        employee.getUser().softDelete();
        employeeRepository.save(employee);
        log.info("Employee soft-deleted: {}", employee.getEmployeeNumber());
    }

    public EmployeeDto getById(UUID id) {
        return EmployeeDto.from(getEmployeeOrThrow(id));
    }

    public EmployeeDto getByUserId(UUID userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        return EmployeeDto.from(employee);
    }

    public PageResponse<EmployeeDto> getAll(String search, String status, Pageable pageable) {
        Page<Employee> page;
        if (search != null && !search.isBlank()) {
            page = employeeRepository.searchEmployees(search, pageable);
        } else if (status != null && !status.isBlank()) {
            page = employeeRepository.findByStatus(
                    Employee.EmploymentStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            page = employeeRepository.findAllActive(pageable);
        }
        return PageResponse.of(page.map(EmployeeDto::from));
    }

    // ─────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────

    private Employee getEmployeeOrThrow(UUID id) {
        return employeeRepository.findById(id)
                .filter(e -> e.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", id));
    }

    private String generateEmployeeNumber() {
        YearMonth now = YearMonth.now();
        String prefix = String.format("EMP-%04d%02d", now.getYear(), now.getMonthValue());
        long count = employeeRepository.count() + 1;
        return String.format("%s-%04d", prefix, count);
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
