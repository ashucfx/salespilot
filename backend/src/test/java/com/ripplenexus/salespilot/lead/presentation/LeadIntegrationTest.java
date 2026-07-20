package com.ripplenexus.salespilot.lead.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ripplenexus.salespilot.AbstractIntegrationTest;
import com.ripplenexus.salespilot.auth.presentation.dto.LoginRequest;
import com.ripplenexus.salespilot.lead.presentation.dto.CreateLeadRequest;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class LeadIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getAdminAccessToken() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@salespilot.com");
        request.setPassword("admin123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        return JsonPath.read(result.getResponse().getContentAsString(), "$.accessToken");
    }

    @Test
    void createLead_WithAdminAuth_Success() throws Exception {
        String token = getAdminAccessToken();

        CreateLeadRequest leadRequest = new CreateLeadRequest();
        leadRequest.setFirstName("Bruce");
        leadRequest.setLastName("Wayne");
        leadRequest.setEmail("bruce@wayne.com");
        leadRequest.setCompanyId(UUID.fromString("11111111-1111-1111-1111-111111111111")); // Seeded company

        mockMvc.perform(post("/api/v1/leads")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(leadRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.firstName").value("Bruce"))
                .andExpect(jsonPath("$.lastName").value("Wayne"));
    }

    @Test
    void getLeads_WithoutAuth_Fails() throws Exception {
        mockMvc.perform(get("/api/v1/leads"))
                .andExpect(status().isUnauthorized());
    }
}
