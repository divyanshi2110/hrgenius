package com.hrgenius.modules.employee;

import com.hrgenius.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/designations")
@RequiredArgsConstructor
public class DesignationController {

    private final DesignationService designationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DesignationResponse>>> getAllDesignations(
            @RequestParam(name = "departmentId", required = false) Long departmentId
    ) {
        List<DesignationResponse> list = designationService.getAllDesignations(departmentId);
        return ResponseEntity.ok(ApiResponse.success(list, "Designations retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DesignationResponse>> getDesignationById(@PathVariable Long id) {
        DesignationResponse desig = designationService.getDesignationById(id);
        return ResponseEntity.ok(ApiResponse.success(desig, "Designation retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DesignationResponse>> createDesignation(@Valid @RequestBody DesignationRequest request) {
        DesignationResponse created = designationService.createDesignation(request);
        return ResponseEntity.ok(ApiResponse.created(created, "Designation created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DesignationResponse>> updateDesignation(
            @PathVariable Long id,
            @Valid @RequestBody DesignationRequest request
    ) {
        DesignationResponse updated = designationService.updateDesignation(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Designation updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDesignation(@PathVariable Long id) {
        designationService.deleteDesignation(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Designation deactivated successfully"));
    }
}
