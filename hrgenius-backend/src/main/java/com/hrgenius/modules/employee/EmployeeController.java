package com.hrgenius.modules.employee;

import com.hrgenius.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getEmployees(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            @RequestParam(name = "status", required = false) String status
    ) {
        List<EmployeeResponse> employees = employeeService.searchAndFilter(keyword, departmentId, status);
        return ResponseEntity.ok(ApiResponse.success(employees, "Employees retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponse employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success(employee, "Employee profile retrieved successfully"));
    }

    @GetMapping("/managers")
    public ResponseEntity<ApiResponse<List<EmployeeSummaryResponse>>> getActiveManagers() {
        List<EmployeeSummaryResponse> managers = employeeService.getActiveManagers();
        return ResponseEntity.ok(ApiResponse.success(managers, "Active managers list retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody EmployeeCreateRequest request) {
        EmployeeResponse created = employeeService.createEmployee(request);
        return ResponseEntity.ok(ApiResponse.created(created, "Employee created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeUpdateRequest request
    ) {
        EmployeeResponse updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Employee updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> toggleEmployeeStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "INACTIVE");
        EmployeeResponse updated = employeeService.toggleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Employee status updated to " + status));
    }
}
