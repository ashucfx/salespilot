package com.ripplenexus.salespilot.employee.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.employee.application.EmployeeService;
import com.ripplenexus.salespilot.employee.presentation.dto.CreateEmployeeRequest;
import com.ripplenexus.salespilot.employee.presentation.dto.EmployeeDto;
import com.ripplenexus.salespilot.employee.presentation.dto.UpdateEmployeeRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Employee management endpoints")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Operation(summary = "Create a new employee (Admin only)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDto>> create(
            @Valid @RequestBody CreateEmployeeRequest request
    ) {
        EmployeeDto dto = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", dto));
    }

    @Operation(summary = "Get current employee profile")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<EmployeeDto>> getMyProfile(@AuthenticationPrincipal User user) {
        EmployeeDto dto = employeeService.getByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @Operation(summary = "Get employee by ID")
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(employeeService.getById(id)));
    }

    @Operation(summary = "List all employees (Admin/Manager)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALES_MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeDto>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        PageRequest pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(ApiResponse.success(employeeService.getAll(search, status, pageable)));
    }

    @Operation(summary = "Update employee (Admin only)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDto>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEmployeeRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Employee updated", employeeService.updateEmployee(id, request)));
    }

    @Operation(summary = "Update own profile")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateMyProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateEmployeeRequest request
    ) {
        EmployeeDto me = employeeService.getByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success(
                "Profile updated", employeeService.updateEmployee(me.getId(), request)));
    }

    @Operation(summary = "Deactivate employee (Admin only)")
    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable UUID id) {
        employeeService.deactivateEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deactivated", null));
    }

    @Operation(summary = "Delete employee (Admin only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted", null));
    }
}
