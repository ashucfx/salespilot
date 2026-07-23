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

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public UUID getLeadId() { return leadId; }
    public void setLeadId(UUID leadId) { this.leadId = leadId; }
    public UUID getCompanyId() { return companyId; }
    public void setCompanyId(UUID companyId) { this.companyId = companyId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }
    public boolean isAutoGenerateLink() { return autoGenerateLink; }
    public void setAutoGenerateLink(boolean autoGenerateLink) { this.autoGenerateLink = autoGenerateLink; }
}
