package com.ripplenexus.salespilot.commission.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.commission.application.PayoutService;
import com.ripplenexus.salespilot.commission.presentation.dto.PayoutDto;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/payouts")
@RequiredArgsConstructor
@Tag(name = "Payouts", description = "Payout management endpoints")
public class PayoutController {

    private final PayoutService payoutService;

    @Operation(summary = "List all payouts (Admin only)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<PayoutDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "payoutDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        return ResponseEntity.ok(ApiResponse.success(payoutService.getAllPayouts(PageRequest.of(page, size, sort))));
    }

    @Operation(summary = "Get current employee's payouts")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse<PayoutDto>>> getMyPayouts(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "payoutDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        return ResponseEntity.ok(ApiResponse.success(payoutService.getMyPayouts(user.getId(), PageRequest.of(page, size, sort))));
    }

    @Operation(summary = "Mark payout as paid (Admin only)")
    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PayoutDto>> markAsPaid(
            @PathVariable UUID id,
            @RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.success("Payout marked as paid", payoutService.markAsPaid(id, request.get("paymentRef"))));
    }
}
