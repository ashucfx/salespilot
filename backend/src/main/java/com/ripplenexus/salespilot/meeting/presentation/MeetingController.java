package com.ripplenexus.salespilot.meeting.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.meeting.application.MeetingService;
import com.ripplenexus.salespilot.meeting.presentation.dto.CreateMeetingRequest;
import com.ripplenexus.salespilot.meeting.presentation.dto.MeetingDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
@Tag(name = "Meetings", description = "Meeting scheduling and management endpoints")
public class MeetingController {

    private final MeetingService meetingService;

    @Operation(summary = "Schedule a new meeting")
    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MeetingDto>> scheduleMeeting(
            @Valid @RequestBody CreateMeetingRequest request,
            @AuthenticationPrincipal User user) {
        MeetingDto meeting = meetingService.scheduleMeeting(request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Meeting scheduled successfully", meeting));
    }

    @Operation(summary = "Get my scheduled meetings")
    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PageResponse<MeetingDto>>> getMyMeetings(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(meetingService.getMyMeetings(user.getId(), pageable)));
    }

    @Operation(summary = "Cancel a meeting")
    @PutMapping("/{id}/cancel")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> cancelMeeting(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        meetingService.cancelMeeting(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Meeting cancelled successfully"));
    }
}
