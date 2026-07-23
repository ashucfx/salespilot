package com.ripplenexus.salespilot.pipeline.presentation;

import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.pipeline.application.PipelineService;
import com.ripplenexus.salespilot.pipeline.domain.PipelineEntry;
import com.ripplenexus.salespilot.pipeline.domain.PipelineStage;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pipeline")
@RequiredArgsConstructor
public class PipelineController {

    private final PipelineService pipelineService;

    @GetMapping("/stages")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ApiResponse<List<PipelineStage>>> getStages() {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.getStages()));
    }

    @GetMapping("/entries")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ApiResponse<List<PipelineEntry>>> getEntries(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ripplenexus.salespilot.auth.domain.User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.success(pipelineService.getEntries(currentUser)));
    }

    @PutMapping("/entries/{leadId}/stage")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ApiResponse<Void>> updateStage(
            @PathVariable UUID leadId,
            @jakarta.validation.Valid @RequestBody UpdateStageRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ripplenexus.salespilot.auth.domain.User currentUser) {
        pipelineService.updateLeadStage(leadId, request.getStageId(), request.getPosition(), currentUser);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @Data
    public static class UpdateStageRequest {
        @jakarta.validation.constraints.NotNull(message = "Stage ID cannot be null")
        private UUID stageId;
        
        @jakarta.validation.constraints.Min(value = 0, message = "Position cannot be negative")
        private int position;
    }
}
