package com.ripplenexus.salespilot.employee.presentation.dto;

import com.ripplenexus.salespilot.employee.domain.Employee;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class EmployeeDto {

    private UUID id;
    private UUID userId;
    private String employeeNumber;
    private String firstName;
    private String lastName;
    private String fullName;
    private String workEmail;
    private String personalEmail;
    private String phone;
    private String whatsapp;
    private String designation;
    private String department;
    private UUID departmentId;
    private String managerName;
    private UUID managerId;
    private LocalDate joiningDate;
    private String status;
    private String profilePicture;
    private String country;
    private String city;
    private BigDecimal performanceRating;
    private Set<String> territories;
    private Set<String> industries;
    private Set<String> services;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public static EmployeeDto from(Employee e) {
        return EmployeeDto.builder()
                .id(e.getId())
                .userId(e.getUser() != null ? e.getUser().getId() : null)
                .employeeNumber(e.getEmployeeNumber())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .fullName(e.getFullName())
                .workEmail(e.getWorkEmail())
                .personalEmail(e.getPersonalEmail())
                .phone(e.getPhone())
                .whatsapp(e.getWhatsapp())
                .designation(e.getDesignation())
                .department(e.getDepartment() != null ? e.getDepartment().getName() : null)
                .departmentId(e.getDepartment() != null ? e.getDepartment().getId() : null)
                .managerName(e.getManager() != null ? e.getManager().getFullName() : null)
                .managerId(e.getManager() != null ? e.getManager().getId() : null)
                .joiningDate(e.getJoiningDate())
                .status(e.getStatus().name())
                .profilePicture(e.getProfilePicture())
                .country(e.getCountry())
                .city(e.getCity())
                .performanceRating(e.getPerformanceRating())
                .territories(e.getTerritories())
                .industries(e.getIndustries())
                .services(e.getServices())
                .notes(e.getNotes())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
