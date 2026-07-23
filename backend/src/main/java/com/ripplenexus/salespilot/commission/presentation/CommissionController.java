package com.ripplenexus.salespilot.commission.presentation;

import com.ripplenexus.salespilot.commission.application.CommissionService;
import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.commission.presentation.dto.EmployeePayoutSummaryDto;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;
    private final com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository employeeRepository;

    @PutMapping("/employee/{employeeId}/rule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateEmployeeCommissionRule(
            @PathVariable UUID employeeId,
            @RequestParam BigDecimal percentage) {
        commissionService.updateEmployeeCommissionRule(employeeId, percentage);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ApiResponse<PageResponse<Commission>>> getEmployeeCommissions(
            @PathVariable UUID employeeId,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ripplenexus.salespilot.auth.domain.User currentUser,
            Pageable pageable) {
            
        boolean isAdminOrManager = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("SALES_MANAGER"));
                
        if (!isAdminOrManager) {
            com.ripplenexus.salespilot.employee.domain.Employee employee = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new com.ripplenexus.salespilot.core.exception.ResourceNotFoundException("Employee profile not found"));
            if (!employee.getId().equals(employeeId)) {
                throw new org.springframework.security.access.AccessDeniedException("You can only view your own commissions.");
            }
        }
        
        return ResponseEntity.ok(ApiResponse.success(commissionService.getByEmployee(employeeId, null, pageable)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> approveCommission(
            @PathVariable UUID id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ripplenexus.salespilot.auth.domain.User currentUser) {
        com.ripplenexus.salespilot.employee.domain.Employee approver = employeeRepository.findByUserId(currentUser.getId()).orElse(null);
        UUID approverId = approver != null ? approver.getId() : currentUser.getId();
        commissionService.approve(id, approverId, "Approved via API");
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> payCommission(
            @PathVariable UUID id,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ripplenexus.salespilot.auth.domain.User currentUser) {
        com.ripplenexus.salespilot.employee.domain.Employee payer = employeeRepository.findByUserId(currentUser.getId()).orElse(null);
        UUID payerId = payer != null ? payer.getId() : currentUser.getId();
        commissionService.markPaid(id, payerId, "PAID_API");
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/payout-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<EmployeePayoutSummaryDto>>> getPayoutSummary(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(commissionService.getPayoutSummary(pageable)));
    }
}
