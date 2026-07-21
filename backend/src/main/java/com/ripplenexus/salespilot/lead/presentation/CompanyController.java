package com.ripplenexus.salespilot.lead.presentation;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.dto.ResponseDto;
import com.ripplenexus.salespilot.lead.application.CompanyService;
import com.ripplenexus.salespilot.lead.domain.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<PageResponse<Company>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(companyService.getAllCompanies(pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Company>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ResponseDto.success(companyService.getCompany(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Company>> create(@Valid @RequestBody Company company) {
        return ResponseEntity.ok(ResponseDto.success(companyService.createCompany(company)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Company>> update(@PathVariable UUID id, @Valid @RequestBody Company company) {
        return ResponseEntity.ok(ResponseDto.success(companyService.updateCompany(id, company)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ResponseDto<Void>> delete(@PathVariable UUID id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(ResponseDto.success(null));
    }
}
