package com.ripplenexus.salespilot.employee.presentation.dto;

import lombok.Data;

@Data
public class UpdateEmployeeProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String whatsapp;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String emergencyName;
    private String emergencyPhone;
    private String emergencyRelation;
    private String profilePicture;
}
