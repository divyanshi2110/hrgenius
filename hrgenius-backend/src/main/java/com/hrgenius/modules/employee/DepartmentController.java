package com.hrgenius.modules.employee;

import com.hrgenius.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments(
            @RequestParam(name = "activeOnly", defaultValue = "false") boolean activeOnly
    ) {
        List<DepartmentResponse> list = activeOnly ?
                departmentService.getActiveDepartments() :
                departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(list, "Departments retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable Long id) {
        DepartmentResponse dept = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(dept, "Department retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@Valid @RequestBody DepartmentRequest request) {
        DepartmentResponse created = departmentService.createDepartment(request);
        return ResponseEntity.ok(ApiResponse.created(created, "Department created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request
    ) {
        DepartmentResponse updated = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Department updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Department deactivated successfully"));
    }
}
