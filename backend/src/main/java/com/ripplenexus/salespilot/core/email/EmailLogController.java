package com.ripplenexus.salespilot.core.email;

import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email-logs")
@RequiredArgsConstructor
@Tag(name = "Email Logs", description = "Admin email delivery monitoring")
public class EmailLogController {

    private final EmailLogRepository emailLogRepository;

    @Operation(summary = "Get all email delivery logs")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<EmailLog>>> getEmailLogs(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(emailLogRepository.findAllByOrderBySentAtDesc(pageable))));
    }
}
