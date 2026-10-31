package com.hrgenius.modules.payroll;

import com.hrgenius.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    // ==========================================
    // PAYROLL PROCESSING & RETRIEVAL
    // ==========================================

    @GetMapping
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getPayrolls(
            @RequestParam(name = "employeeId", required = false) Long employeeId,
            @RequestParam(name = "month", required = false) Integer month,
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "status", required = false) String status
    ) {
        List<PayrollResponse> list = payrollService.getPayrolls(employeeId, month, year, status);
        return ResponseEntity.ok(ApiResponse.success(list, "Payroll records retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PayrollResponse>> getPayrollById(@PathVariable Long id) {
        PayrollResponse res = payrollService.getPayrollById(id);
        return ResponseEntity.ok(ApiResponse.success(res, "Payroll details retrieved"));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> getEmployeePayrolls(@PathVariable Long employeeId) {
        List<PayrollResponse> list = payrollService.getPayrollsByEmployeeId(employeeId);
        return ResponseEntity.ok(ApiResponse.success(list, "Employee payroll history retrieved"));
    }

    @PostMapping("/process")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PayrollResponse>>> processPayroll(@Valid @RequestBody PayrollProcessRequest request) {
        List<PayrollResponse> result = payrollService.processPayroll(request);
        return ResponseEntity.ok(ApiResponse.success(result, "Payroll processed successfully for " + result.size() + " employee(s)"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PayrollResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.getOrDefault("status", "PAID");
        PayrollResponse updated = payrollService.updatePayrollStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Payroll status updated to " + status));
    }

    // ==========================================
    // SALARY STRUCTURES
    // ==========================================

    @GetMapping("/salary-structures")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<SalaryStructureResponse>>> getAllSalaryStructures() {
        List<SalaryStructureResponse> list = payrollService.getAllSalaryStructures();
        return ResponseEntity.ok(ApiResponse.success(list, "All salary structures retrieved"));
    }

    @GetMapping("/salary-structures/employee/{employeeId}")
    public ResponseEntity<ApiResponse<SalaryStructureResponse>> getSalaryStructureByEmployeeId(@PathVariable Long employeeId) {
        SalaryStructureResponse res = payrollService.getSalaryStructureByEmployeeId(employeeId);
        return ResponseEntity.ok(ApiResponse.success(res, "Salary structure retrieved"));
    }

    @PostMapping("/salary-structures")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SalaryStructureResponse>> saveSalaryStructure(@Valid @RequestBody SalaryStructureRequest request) {
        SalaryStructureResponse saved = payrollService.saveOrUpdateSalaryStructure(request);
        return ResponseEntity.ok(ApiResponse.success(saved, "Salary structure saved successfully"));
    }
}
