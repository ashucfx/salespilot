package com.ripplenexus.salespilot.meeting.presentation.dto;

import com.ripplenexus.salespilot.meeting.domain.Meeting;



import java.time.Instant;
import java.util.UUID;

public class MeetingDto {
    private UUID id;
    private String title;
    private UUID leadId;
    private UUID organizerId;
    private String type;
    private String status;
    private Instant scheduledAt;
    private Integer durationMinutes;
    private String location;
    private String meetingUrl;
    private String agenda;

    public static MeetingDto from(Meeting meeting) {
        MeetingDto dto = new MeetingDto();
        dto.setId(meeting.getId());
        dto.setTitle(meeting.getTitle());
        dto.setLeadId(meeting.getLead() != null ? meeting.getLead().getId() : null);
        dto.setOrganizerId(meeting.getOrganizer() != null ? meeting.getOrganizer().getId() : null);
        dto.setType(meeting.getType().name());
        dto.setStatus(meeting.getStatus().name());
        dto.setScheduledAt(meeting.getScheduledAt());
        dto.setDurationMinutes(meeting.getDurationMinutes());
        dto.setLocation(meeting.getLocation());
        dto.setMeetingUrl(meeting.getMeetingUrl());
        dto.setAgenda(meeting.getAgenda());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public UUID getLeadId() { return leadId; }
    public void setLeadId(UUID leadId) { this.leadId = leadId; }
    public UUID getOrganizerId() { return organizerId; }
    public void setOrganizerId(UUID organizerId) { this.organizerId = organizerId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }
    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }
}
