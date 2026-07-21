package com.ripplenexus.salespilot.meeting.presentation.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CreateMeetingRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private UUID leadId;
    private UUID companyId;
    
    @NotNull(message = "Meeting type is required")
    private String type; // ONLINE, OFFLINE, PHONE_CALL
    
    @NotNull(message = "Scheduled time is required")
    @Future(message = "Scheduled time must be in the future")
    private Instant scheduledAt;
    
    private Integer durationMinutes = 60;
    private String location;
    private String agenda;
    
    private boolean autoGenerateLink = true;
}
