package com.ripplenexus.salespilot.meeting.application;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import com.ripplenexus.salespilot.meeting.domain.Meeting;
import com.ripplenexus.salespilot.meeting.infrastructure.MeetingRepository;
import com.ripplenexus.salespilot.meeting.presentation.dto.CreateMeetingRequest;
import com.ripplenexus.salespilot.meeting.presentation.dto.MeetingDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadRepository leadRepository;
    private final EmailService emailService;

    public MeetingDto scheduleMeeting(CreateMeetingRequest request, UUID organizerUserId) {
        Employee organizer = employeeRepository.findByUserId(organizerUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        Lead lead = null;
        if (request.getLeadId() != null) {
            lead = leadRepository.findById(request.getLeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lead", request.getLeadId()));
        }

        String meetingUrl = request.getLocation();
        Meeting.MeetingType type = Meeting.MeetingType.valueOf(request.getType());

        if (type == Meeting.MeetingType.ONLINE && request.isAutoGenerateLink()) {
            // Generate a free, secure Jitsi Meet link
            String uniqueRoom = "SalesPilot-Meeting-" + UUID.randomUUID().toString().substring(0, 8);
            meetingUrl = "https://meet.jit.si/" + uniqueRoom;
        }

        Meeting meeting = Meeting.builder()
                .title(request.getTitle())
                .lead(lead)
                .organizer(organizer)
                .type(type)
                .scheduledAt(request.getScheduledAt())
                .durationMinutes(request.getDurationMinutes())
                .location(type == Meeting.MeetingType.ONLINE ? "Online" : request.getLocation())
                .meetingUrl(meetingUrl)
                .agenda(request.getAgenda())
                .status(Meeting.MeetingStatus.SCHEDULED)
                .build();

        meeting.getAttendees().add(organizer);

        meeting = meetingRepository.save(meeting);
        log.info("Meeting scheduled: {} by {}", meeting.getId(), organizer.getEmployeeNumber());

        if (lead != null && lead.getContactEmail() != null) {
            // Ideally we'd send a real calendar invite email here, reusing the email service
            log.info("Would send meeting invite to lead email: {}", lead.getContactEmail());
        }

        return MeetingDto.from(meeting);
    }

    public PageResponse<MeetingDto> getMyMeetings(UUID userId, Pageable pageable) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
                
        return PageResponse.of(meetingRepository.findByOrganizerId(employee.getId(), pageable).map(MeetingDto::from));
    }

    public void cancelMeeting(UUID meetingId, UUID userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting", meetingId));

        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (!meeting.getOrganizer().getId().equals(employee.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only cancel your own meetings.");
        }

        meeting.setStatus(Meeting.MeetingStatus.CANCELLED);
        meetingRepository.save(meeting);
    }
}
