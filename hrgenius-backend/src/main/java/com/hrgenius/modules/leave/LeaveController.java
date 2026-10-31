package com.hrgenius.modules.leave;

import com.hrgenius.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    // ==========================================
    // LEAVE TYPES
    // ==========================================

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<LeaveTypeResponse>>> getAllLeaveTypes(
            @RequestParam(name = "activeOnly", defaultValue = "false") boolean activeOnly
    ) {
        List<LeaveTypeResponse> list = leaveService.getAllLeaveTypes(activeOnly);
        return ResponseEntity.ok(ApiResponse.success(list, "Leave types retrieved successfully"));
    }

    @GetMapping("/types/{id}")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> getLeaveTypeById(@PathVariable Long id) {
        LeaveTypeResponse res = leaveService.getLeaveTypeById(id);
        return ResponseEntity.ok(ApiResponse.success(res, "Leave type retrieved"));
    }

    @PostMapping("/types")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> createLeaveType(@Valid @RequestBody LeaveTypeRequest request) {
        LeaveTypeResponse created = leaveService.createLeaveType(request);
        return ResponseEntity.ok(ApiResponse.created(created, "Leave type created successfully"));
    }

    @PutMapping("/types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveTypeResponse>> updateLeaveType(
            @PathVariable Long id,
            @Valid @RequestBody LeaveTypeRequest request
    ) {
        LeaveTypeResponse updated = leaveService.updateLeaveType(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Leave type updated successfully"));
    }

    @DeleteMapping("/types/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLeaveType(@PathVariable Long id) {
        leaveService.deleteLeaveType(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Leave type deactivated successfully"));
    }

    // ==========================================
    // LEAVE REQUESTS
    // ==========================================

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getLeaveRequests(
            @RequestParam(name = "employeeId", required = false) Long employeeId,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "leaveTypeId", required = false) Long leaveTypeId,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<LeaveResponse> list = leaveService.searchAndFilter(employeeId, departmentId, status, leaveTypeId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(list, "Leave requests retrieved successfully"));
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<ApiResponse<LeaveResponse>> getLeaveRequestById(@PathVariable Long id) {
        LeaveResponse res = leaveService.getLeaveRequestById(id);
        return ResponseEntity.ok(ApiResponse.success(res, "Leave request retrieved"));
    }

    @GetMapping("/requests/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getEmployeeLeaveRequests(@PathVariable Long employeeId) {
        List<LeaveResponse> list = leaveService.getLeaveRequestsByEmployee(employeeId);
        return ResponseEntity.ok(ApiResponse.success(list, "Employee leave requests retrieved"));
    }

    @GetMapping("/requests/team/{managerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<LeaveResponse>>> getTeamLeaveRequests(@PathVariable Long managerId) {
        List<LeaveResponse> list = leaveService.getTeamLeaveRequests(managerId);
        return ResponseEntity.ok(ApiResponse.success(list, "Team leave requests retrieved"));
    }

    @PostMapping("/requests")
    public ResponseEntity<ApiResponse<LeaveResponse>> createLeaveRequest(@Valid @RequestBody LeaveRequestCreateDto dto) {
        LeaveResponse created = leaveService.createLeaveRequest(dto);
        return ResponseEntity.ok(ApiResponse.created(created, "Leave request submitted successfully"));
    }

    @PostMapping("/requests/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<LeaveResponse>> approveLeaveRequest(
            @PathVariable Long id,
            @RequestBody(required = false) LeaveActionDto actionDto
    ) {
        Long approverId = (actionDto != null) ? actionDto.getApproverEmployeeId() : null;
        LeaveResponse approved = leaveService.approveLeaveRequest(id, approverId);
        return ResponseEntity.ok(ApiResponse.success(approved, "Leave request approved successfully"));
    }

    @PostMapping("/requests/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<LeaveResponse>> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody LeaveActionDto actionDto
    ) {
        Long approverId = (actionDto != null) ? actionDto.getApproverEmployeeId() : null;
        String reason = (actionDto != null) ? actionDto.getRejectionReason() : null;
        LeaveResponse rejected = leaveService.rejectLeaveRequest(id, approverId, reason);
        return ResponseEntity.ok(ApiResponse.success(rejected, "Leave request rejected"));
    }

    @PostMapping("/requests/{id}/cancel")
    public ResponseEntity<ApiResponse<LeaveResponse>> cancelLeaveRequest(
            @PathVariable Long id,
            @RequestParam(name = "employeeId", required = false) Long employeeId
    ) {
        LeaveResponse cancelled = leaveService.cancelLeaveRequest(id, employeeId);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Leave request cancelled successfully"));
    }

    // ==========================================
    // LEAVE BALANCES
    // ==========================================

    @GetMapping("/balances/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveBalanceResponse>>> getLeaveBalances(
            @PathVariable Long employeeId,
            @RequestParam(name = "year", required = false) Integer year
    ) {
        List<LeaveBalanceResponse> balances = leaveService.getLeaveBalances(employeeId, year);
        return ResponseEntity.ok(ApiResponse.success(balances, "Leave balances retrieved successfully"));
    }
}
