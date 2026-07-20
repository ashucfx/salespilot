package com.ripplenexus.salespilot.auth.presentation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserInfoDto user;
    private boolean otpRequired;
}
