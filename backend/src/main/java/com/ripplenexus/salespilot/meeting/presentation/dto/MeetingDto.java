package com.ripplenexus.salespilot.meeting.presentation.dto;

import com.ripplenexus.salespilot.meeting.domain.Meeting;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
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
        return MeetingDto.builder()
                .id(meeting.getId())
                .title(meeting.getTitle())
                .leadId(meeting.getLead() != null ? meeting.getLead().getId() : null)
                .organizerId(meeting.getOrganizer() != null ? meeting.getOrganizer().getId() : null)
                .type(meeting.getType().name())
                .status(meeting.getStatus().name())
                .scheduledAt(meeting.getScheduledAt())
                .durationMinutes(meeting.getDurationMinutes())
                .location(meeting.getLocation())
                .meetingUrl(meeting.getMeetingUrl())
                .agenda(meeting.getAgenda())
                .build();
    }
}
