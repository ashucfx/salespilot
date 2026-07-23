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
    public ResponseEntity<ApiResponse<Employee>> onboardUser(@jakarta.validation.Valid @RequestBody OnboardUserRequest request) {
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
        @jakarta.validation.constraints.Email
        @jakarta.validation.constraints.NotBlank
        private String email;
        
        @jakarta.validation.constraints.NotBlank
        private String firstName;
        
        @jakarta.validation.constraints.NotBlank
        private String lastName;
        
        @jakarta.validation.constraints.NotBlank
        private String roleName;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getRoleName() { return roleName; }
        public void setRoleName(String roleName) { this.roleName = roleName; }
    }
}
