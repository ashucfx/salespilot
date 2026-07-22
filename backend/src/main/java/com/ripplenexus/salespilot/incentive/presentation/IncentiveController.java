package com.ripplenexus.salespilot.incentive.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.incentive.application.IncentiveService;
import com.ripplenexus.salespilot.incentive.presentation.dto.EmployeeIncentiveDto;
import com.ripplenexus.salespilot.incentive.presentation.dto.IncentiveDto;
import com.ripplenexus.salespilot.incentive.presentation.dto.LeaderboardDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/incentives")
@RequiredArgsConstructor
@Tag(name = "Incentives", description = "Employee incentive challenges and leaderboard endpoints")
public class IncentiveController {

    private final IncentiveService incentiveService;

    @Operation(summary = "Get all active incentive challenges")
    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<IncentiveDto>>> getActiveIncentives() {
        return ResponseEntity.ok(ApiResponse.success(incentiveService.getAllActiveIncentives()));
    }

    @Operation(summary = "Get current user's incentive progress and challenges")
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<EmployeeIncentiveDto>>> getMyIncentives(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.success(incentiveService.getEmployeeIncentives(user.getId())));
    }

    @Operation(summary = "Claim earned incentive reward bonus")
    @PostMapping("/claim/{incentiveId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EmployeeIncentiveDto>> claimIncentive(
            @PathVariable UUID incentiveId,
            @AuthenticationPrincipal User user
    ) {
        EmployeeIncentiveDto dto = incentiveService.claimIncentive(user.getId(), incentiveId);
        return ResponseEntity.ok(ApiResponse.success("Incentive reward claimed successfully!", dto));
    }

    @Operation(summary = "Get top sales leaderboard rankings")
    @GetMapping("/leaderboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LeaderboardDto>>> getLeaderboard() {
        return ResponseEntity.ok(ApiResponse.success(incentiveService.getLeaderboard()));
    }
}
