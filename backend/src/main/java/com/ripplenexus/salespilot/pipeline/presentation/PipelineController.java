package com.ripplenexus.salespilot.pipeline.presentation;

import com.ripplenexus.salespilot.core.dto.ResponseDto;
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
@RequestMapping("/api/pipeline")
@RequiredArgsConstructor
public class PipelineController {

    private final PipelineService pipelineService;

    @GetMapping("/stages")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<List<PipelineStage>>> getStages() {
        return ResponseEntity.ok(ResponseDto.success(pipelineService.getStages()));
    }

    @GetMapping("/entries")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<List<PipelineEntry>>> getEntries() {
        return ResponseEntity.ok(ResponseDto.success(pipelineService.getEntries()));
    }

    @PutMapping("/entries/{leadId}/stage")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Void>> updateStage(
            @PathVariable UUID leadId,
            @RequestBody UpdateStageRequest request) {
        pipelineService.updateLeadStage(leadId, request.getStageId(), request.getPosition());
        return ResponseEntity.ok(ResponseDto.success(null));
    }

    @Data
    public static class UpdateStageRequest {
        private UUID stageId;
        private int position;
    }
}
