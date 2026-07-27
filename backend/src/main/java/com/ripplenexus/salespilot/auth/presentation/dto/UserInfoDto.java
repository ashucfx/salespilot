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

    public static UserInfoDto from(User user) {
        UserInfoDto dto = new UserInfoDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        dto.setEmailVerified(user.isEmailVerified());
        dto.setOtpEnabled(user.isOtpEnabled());
        return dto;
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
}
