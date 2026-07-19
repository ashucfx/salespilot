package com.ripplenexus.salespilot.commission.presentation;

import com.ripplenexus.salespilot.commission.application.CommissionService;
import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<PageResponse<Commission>>> getEmployeeCommissions(
            @PathVariable UUID employeeId,
            Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(commissionService.getCommissionsForEmployee(employeeId, pageable)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ResponseDto<Commission>> approveCommission(@PathVariable UUID id) {
        return ResponseEntity.ok(ResponseDto.success(commissionService.approveCommission(id)));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<Commission>> payCommission(@PathVariable UUID id) {
        return ResponseEntity.ok(ResponseDto.success(commissionService.markCommissionAsPaid(id)));
    }
}
