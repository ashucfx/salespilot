package com.ripplenexus.salespilot.auth.application;

import com.ripplenexus.salespilot.auth.domain.RefreshToken;
import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.auth.infrastructure.RefreshTokenRepository;
import com.ripplenexus.salespilot.auth.infrastructure.RoleRepository;
import com.ripplenexus.salespilot.auth.infrastructure.UserRepository;
import com.ripplenexus.salespilot.auth.presentation.dto.*;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.core.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${salespilot.jwt.refresh-token-expiry}")
    private long refreshTokenExpiry;

    @Value("${salespilot.frontend-url}")
    private String frontendUrl;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getEmail()));

        // Authenticate password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", SECURE_RANDOM.nextInt(1000000));
        user.setOtpCode(hashOtp(otpCode));
        user.setOtpExpiry(Instant.now().plus(10, java.time.temporal.ChronoUnit.MINUTES));
        userRepository.save(user);

        // Send OTP Email
        emailService.sendOtpEmail(user.getEmail(), otpCode);

        log.info("OTP generated and sent to: {}", user.getEmail());

        return AuthResponse.builder()
                .otpRequired(true)
                .build();
    }

    public AuthResponse verifyOtp(String email, String otpCode, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(Instant.now())) {
            throw new org.springframework.security.authentication.BadCredentialsException("OTP has expired");
        }

        if (!hashOtp(otpCode).equals(user.getOtpCode())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Invalid OTP code");
        }

        // Clear OTP
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user, buildClaims(user));
        RefreshToken refreshToken = createRefreshToken(user);

        // Update last login
        userRepository.updateLastLogin(user.getId(), Instant.now());

        log.info("User logged in: {} from IP: {}", user.getEmail(), ipAddress);

        return buildAuthResponse(user, accessToken, refreshToken.getToken());
    }

    public AuthResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException("Invalid refresh token."));

        if (!refreshToken.isValid()) {
            throw new BusinessException("Refresh token has expired or been revoked. Please log in again.");
        }

        User user = refreshToken.getUser();

        // Rotate refresh token
        refreshToken.revoke();
        RefreshToken newRefreshToken = createRefreshToken(user);

        String accessToken = jwtUtil.generateAccessToken(user, buildClaims(user));

        return buildAuthResponse(user, accessToken, newRefreshToken.getToken());
    }

    public void logout(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.revoke();
            refreshTokenRepository.save(rt);
        });
    }

    public void logoutAll(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        refreshTokenRepository.revokeAllByUser(user, Instant.now());
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = generateSecureToken();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(Instant.now().plusSeconds(3600)); // 1 hour
            userRepository.save(user);

            String resetLink = frontendUrl + "/auth/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
            log.info("Password reset requested for: {}", user.getEmail());
        });
        // Always return success to prevent email enumeration
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new BusinessException("Invalid or expired password reset link."));

        if (user.getPasswordResetTokenExpiry() == null
                || Instant.now().isAfter(user.getPasswordResetTokenExpiry())) {
            throw new BusinessException("Password reset link has expired. Please request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        // Revoke all refresh tokens for security
        refreshTokenRepository.revokeAllByUser(user, Instant.now());
        log.info("Password reset successfully for: {}", user.getEmail());
    }

    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenRepository.revokeAllByUser(user, Instant.now());
        log.info("Password changed for user: {}", user.getEmail());
    }

    // ─────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────

    private RefreshToken createRefreshToken(User user) {
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(generateSecureToken())
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiry))
                .build();
        return refreshTokenRepository.save(token);
    }

    private String hashOtp(String otp) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.Base64.getEncoder().encodeToString(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash OTP", e);
        }
    }

    private Map<String, Object> buildClaims(User user) {
        return Map.of(
                "userId", user.getId().toString(),
                "roles", user.getRoles().stream().map(Role::getName).toList(),
                "email", user.getEmail()
        );
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(UserInfoDto.from(user))
                .build();
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[48];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
