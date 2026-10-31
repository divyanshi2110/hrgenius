package com.hrgenius.modules.attendance;

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
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendance(
            @RequestParam(name = "employeeId", required = false) Long employeeId,
            @RequestParam(name = "departmentId", required = false) Long departmentId,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate attendanceDate,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<AttendanceResponse> list = attendanceService.searchAndFilter(employeeId, departmentId, status, attendanceDate, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(list, "Attendance records retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(@PathVariable Long id) {
        AttendanceResponse res = attendanceService.getAttendanceById(id);
        return ResponseEntity.ok(ApiResponse.success(res, "Attendance record retrieved"));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendanceByEmployeeId(@PathVariable Long employeeId) {
        List<AttendanceResponse> list = attendanceService.getAttendanceByEmployeeId(employeeId);
        return ResponseEntity.ok(ApiResponse.success(list, "Employee attendance records retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceResponse>> recordAttendance(@Valid @RequestBody AttendanceCreateRequest request) {
        AttendanceResponse created = attendanceService.recordAttendance(request);
        return ResponseEntity.ok(ApiResponse.created(created, "Attendance recorded successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceUpdateRequest request
    ) {
        AttendanceResponse updated = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Attendance updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Attendance record deleted successfully"));
    }
}
