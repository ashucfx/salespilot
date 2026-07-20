package com.ripplenexus.salespilot.auth.application;

import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.auth.infrastructure.RoleRepository;
import com.ripplenexus.salespilot.auth.infrastructure.UserRepository;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public Employee onboardNewUser(String email, String firstName, String lastName, String roleName) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        // Generate secure temporary password
        String tempPassword = generateTempPassword();

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(tempPassword))
                .isActive(true)
                .isEmailVerified(true)
                .roles(Set.of(role))
                .build();
        
        user = userRepository.save(user);

        // Generate unique employee number
        String empNum = "EMP-" + LocalDate.now().getYear() + "-" + (System.currentTimeMillis() % 10000);

        Employee employee = Employee.builder()
                .user(user)
                .employeeNumber(empNum)
                .firstName(firstName)
                .lastName(lastName)
                .workEmail(email)
                .joiningDate(LocalDate.now())
                .status(Employee.EmploymentStatus.ACTIVE)
                .build();
        
        employee = employeeRepository.save(employee);

        log.info("Onboarded new user {} as {}", email, roleName);

        // Trigger welcome email with temporary password
        emailService.sendWelcomeEmail(email, firstName + " " + lastName, tempPassword);

        return employee;
    }

    private String generateTempPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[9];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
