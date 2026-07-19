package com.ripplenexus.salespilot.auth.application;

import com.ripplenexus.salespilot.auth.domain.RefreshToken;
import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.auth.infrastructure.RefreshTokenRepository;
import com.ripplenexus.salespilot.auth.infrastructure.RoleRepository;
import com.ripplenexus.salespilot.auth.infrastructure.UserRepository;
import com.ripplenexus.salespilot.auth.presentation.dto.AuthResponse;
import com.ripplenexus.salespilot.auth.presentation.dto.LoginRequest;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.core.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private JwtUtil jwtUtil;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Role testRole;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpiry", 86400000L);
        ReflectionTestUtils.setField(authService, "frontendUrl", "http://localhost");

        testRole = new Role();
        testRole.setName("ROLE_USER");

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("test@salespilot.com");
        testUser.setPasswordHash("hashed_password");
        testUser.setRoles(Set.of(testRole));
    }

    @Test
    void login_Success() {
        // Arrange
        LoginRequest request = new LoginRequest("test@salespilot.com", "password123");
        
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateAccessToken(any(), any())).thenReturn("mocked.access.token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        AuthResponse response = authService.login(request, "127.0.0.1", "Mozilla");

        // Assert
        assertNotNull(response);
        assertEquals("mocked.access.token", response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("test@salespilot.com", response.getUser().getEmail());
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).updateLastLogin(eq(testUser.getId()), any());
    }

    @Test
    void login_UserNotFound() {
        // Arrange
        LoginRequest request = new LoginRequest("nonexistent@salespilot.com", "password123");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> 
            authService.login(request, "127.0.0.1", "Mozilla")
        );
        
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
