package com.ripplenexus.salespilot.employee.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateEmployeeRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Work email is required")
    @Email(message = "Invalid email format")
    private String workEmail;

    @Email(message = "Invalid personal email format")
    private String personalEmail;

    private String phone;
    private String whatsapp;

    @NotBlank(message = "Designation is required")
    private String designation;

    private UUID departmentId;
    private UUID managerId;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    private String role = "SALES_EMPLOYEE";

    private BigDecimal salary;
    private String notes;
}
