package com.ripplenexus.salespilot.employee.presentation.dto;

import com.ripplenexus.salespilot.employee.domain.Employee;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Data
public class AdminUpdateEmployeeRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String whatsapp;
    private String designation;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private UUID departmentId;
    private UUID managerId;
    private Employee.EmploymentStatus status;
    private BigDecimal salary;
    private BigDecimal performanceRating;
    private String notes;
    private String emergencyName;
    private String emergencyPhone;
    private String emergencyRelation;
    private Set<String> territories;
    private Set<String> industries;
    private Set<String> services;
}
