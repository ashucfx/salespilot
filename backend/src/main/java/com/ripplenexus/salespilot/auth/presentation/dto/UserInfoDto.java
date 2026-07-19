package com.ripplenexus.salespilot.auth.presentation.dto;

import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;
import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
public class UserInfoDto {
    private UUID id;
    private String email;
    private Set<String> roles;
    private boolean emailVerified;

    public static UserInfoDto from(User user) {
        return UserInfoDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .emailVerified(user.isEmailVerified())
                .build();
    }
}
