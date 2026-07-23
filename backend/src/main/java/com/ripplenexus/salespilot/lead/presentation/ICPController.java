package com.ripplenexus.salespilot.lead.presentation;

import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.lead.application.ICPService;
import com.ripplenexus.salespilot.lead.domain.IdealCustomerProfile;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/icps")
@RequiredArgsConstructor
public class ICPController {

    private final ICPService icpService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ApiResponse<PageResponse<IdealCustomerProfile>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(icpService.getAll(pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ApiResponse<IdealCustomerProfile>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(icpService.getICP(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ApiResponse<IdealCustomerProfile>> create(@Valid @RequestBody IdealCustomerProfile icp) {
        return ResponseEntity.ok(ApiResponse.success(icpService.createICP(icp)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ApiResponse<IdealCustomerProfile>> update(@PathVariable UUID id, @Valid @RequestBody IdealCustomerProfile icp) {
        return ResponseEntity.ok(ApiResponse.success(icpService.updateICP(id, icp)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        icpService.deleteICP(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
