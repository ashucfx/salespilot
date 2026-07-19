package com.ripplenexus.salespilot.lead.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.lead.application.LeadService;
import com.ripplenexus.salespilot.lead.presentation.dto.CreateLeadRequest;
import com.ripplenexus.salespilot.lead.presentation.dto.LeadDto;
import com.ripplenexus.salespilot.lead.presentation.dto.UpdateLeadRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
@Tag(name = "Leads", description = "Lead management with employee data isolation")
public class LeadController {

    private final LeadService leadService;

    @Operation(summary = "Create a new lead")
    @PostMapping
    public ResponseEntity<ApiResponse<LeadDto>> create(
            @Valid @RequestBody CreateLeadRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lead created", leadService.createLead(request, user)));
    }

    @Operation(summary = "Get lead by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadDto>> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.success(leadService.getById(id, user)));
    }

    @Operation(summary = "List leads (employees see only assigned leads)")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<LeadDto>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) UUID assignedTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @AuthenticationPrincipal User user
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        return ResponseEntity.ok(ApiResponse.success(
                leadService.getAll(search, status, priority, assignedTo, user,
                        PageRequest.of(page, size, sort))));
    }

    @Operation(summary = "Update lead")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LeadDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateLeadRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lead updated", leadService.updateLead(id, request, user)));
    }

    @Operation(summary = "Delete lead (Admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        leadService.deleteLead(id, user);
        return ResponseEntity.ok(ApiResponse.success("Lead deleted", null));
    }
}
