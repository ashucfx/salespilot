package com.ripplenexus.salespilot.auth.presentation.dto;

import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserInfoDto {
    private UUID id;
    private String email;
    private Set<String> roles;
    private boolean emailVerified;
    private boolean otpEnabled;
    private String firstName;
    private String lastName;
    private String fullName;
    private String profilePicture;

    public static UserInfoDto from(User user) {
        UserInfoDto dto = new UserInfoDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        dto.setEmailVerified(user.isEmailVerified());
        dto.setOtpEnabled(user.isOtpEnabled());
        // Employee name fields are optionally enriched after creation
        return dto;
    }

    /** Enriches dto with employee profile data (name, avatar). */
    public UserInfoDto withEmployee(String firstName, String lastName, String profilePicture) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = (firstName != null ? firstName : "") + (lastName != null ? " " + lastName : "");
        this.profilePicture = profilePicture;
        return this;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public boolean isOtpEnabled() { return otpEnabled; }
    public void setOtpEnabled(boolean otpEnabled) { this.otpEnabled = otpEnabled; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}

