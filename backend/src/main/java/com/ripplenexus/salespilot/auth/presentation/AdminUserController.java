package com.ripplenexus.salespilot.auth.presentation;

import com.ripplenexus.salespilot.auth.application.AdminUserService;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.employee.domain.Employee;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping("/onboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Employee>> onboardUser(@RequestBody OnboardUserRequest request) {
        Employee employee = adminUserService.onboardNewUser(
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                request.getRoleName()
        );
        return ResponseEntity.ok(ApiResponse.success(employee));
    }

    @Data
    public static class OnboardUserRequest {
        private String email;
        private String firstName;
        private String lastName;
        private String roleName;
    }
}
