package com.ripplenexus.salespilot.lead.presentation;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.dto.ResponseDto;
import com.ripplenexus.salespilot.lead.application.ICPService;
import com.ripplenexus.salespilot.lead.domain.IdealCustomerProfile;
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
    public ResponseEntity<ResponseDto<PageResponse<IdealCustomerProfile>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(icpService.getAll(pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<IdealCustomerProfile>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ResponseDto.success(icpService.getICP(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ResponseDto<IdealCustomerProfile>> create(@RequestBody IdealCustomerProfile icp) {
        return ResponseEntity.ok(ResponseDto.success(icpService.createICP(icp)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ResponseDto<IdealCustomerProfile>> update(@PathVariable UUID id, @RequestBody IdealCustomerProfile icp) {
        return ResponseEntity.ok(ResponseDto.success(icpService.updateICP(id, icp)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<Void>> delete(@PathVariable UUID id) {
        icpService.deleteICP(id);
        return ResponseEntity.ok(ResponseDto.success(null));
    }
}
