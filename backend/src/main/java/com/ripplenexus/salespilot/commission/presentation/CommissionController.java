package com.ripplenexus.salespilot.commission.presentation;

import com.ripplenexus.salespilot.commission.application.CommissionService;
import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.commission.presentation.dto.EmployeePayoutSummaryDto;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.dto.ResponseDto;
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

    @PutMapping("/employee/{employeeId}/rule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<Void>> updateEmployeeCommissionRule(
            @PathVariable UUID employeeId,
            @RequestParam BigDecimal percentage) {
        commissionService.updateEmployeeCommissionRule(employeeId, percentage);
        return ResponseEntity.ok(ResponseDto.success(null));
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<PageResponse<Commission>>> getEmployeeCommissions(
            @PathVariable UUID employeeId,
            Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(commissionService.getByEmployee(employeeId, null, pageable)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ResponseDto<Void>> approveCommission(@PathVariable UUID id) {
        // TODO: Pass actual logged-in user employee ID
        commissionService.approve(id, UUID.randomUUID(), "Approved via API");
        return ResponseEntity.ok(ResponseDto.success(null));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<Void>> payCommission(@PathVariable UUID id) {
        // TODO: Pass actual logged-in user employee ID
        commissionService.markPaid(id, UUID.randomUUID(), "PAID_API");
        return ResponseEntity.ok(ResponseDto.success(null));
    }

    @GetMapping("/payout-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<PageResponse<EmployeePayoutSummaryDto>>> getPayoutSummary(Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(commissionService.getPayoutSummary(pageable)));
    }
}
