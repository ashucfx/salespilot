package com.ripplenexus.salespilot.audit.application;

import com.ripplenexus.salespilot.audit.domain.AuditLog;
import com.ripplenexus.salespilot.audit.infrastructure.AuditLogRepository;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PageResponse<AuditLog> getAuditLogs(Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.findAll(pageable);
        return PageResponse.of(page);
    }
}
