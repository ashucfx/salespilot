package com.ripplenexus.salespilot.auth.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ripplenexus.salespilot.AbstractIntegrationTest;
import com.ripplenexus.salespilot.auth.presentation.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class AuthIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_Success_ReturnsJwt() throws Exception {
        // Because of V13__seed_data.sql, admin@salespilot.com / admin123 exists in the DB
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@salespilot.com");
        request.setPassword("admin123");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user.email").value("admin@salespilot.com"));
    }

    @Test
    void login_Failure_WrongPassword() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@salespilot.com");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}
