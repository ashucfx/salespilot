package com.ripplenexus.salespilot.analytics.presentation;

import com.ripplenexus.salespilot.analytics.application.AnalyticsService;
import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics endpoints for dashboard statistics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final EmployeeRepository employeeRepository;

    @Operation(summary = "Get admin dashboard statistics")
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = analyticsService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @Operation(summary = "Get current user dashboard statistics")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyStats(@AuthenticationPrincipal User user) {
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
        
        Map<String, Object> stats = analyticsService.getEmployeeDashboard(employee.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
