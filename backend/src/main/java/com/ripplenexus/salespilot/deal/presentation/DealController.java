package com.ripplenexus.salespilot.deal.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.deal.application.DealService;
import com.ripplenexus.salespilot.deal.presentation.dto.CloseDealRequest;
import com.ripplenexus.salespilot.deal.presentation.dto.DealDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/deals")
@Tag(name = "Deals", description = "Deals pipeline and management endpoints")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping
    @Operation(summary = "Get all deals based on user permissions")
    public ResponseEntity<ApiResponse<PageResponse<DealDto>>> getAllDeals(
            @AuthenticationPrincipal User currentUser,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(dealService.getAllDeals(currentUser, pageable)));
    }

    @PostMapping("/close/{leadId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    @Operation(summary = "Close a deal when a lead is marked WON")
    public ResponseEntity<ApiResponse<DealDto>> closeDeal(
            @PathVariable UUID leadId,
            @Valid @RequestBody CloseDealRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(ApiResponse.success("Deal closed successfully", dealService.closeDeal(leadId, request, currentUser.getId())));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    @Operation(summary = "Get deals by employee ID")
    public ResponseEntity<ApiResponse<PageResponse<DealDto>>> getByEmployee(
            @PathVariable UUID employeeId,
            Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(dealService.getByEmployee(employeeId, pageable)));
    }
}
