package com.ripplenexus.salespilot.audit.presentation;

import com.ripplenexus.salespilot.audit.application.AuditLogService;
import com.ripplenexus.salespilot.audit.domain.AuditLog;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.dto.ResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<PageResponse<AuditLog>>> getAuditLogs(Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(auditLogService.getAuditLogs(pageable)));
    }
}
