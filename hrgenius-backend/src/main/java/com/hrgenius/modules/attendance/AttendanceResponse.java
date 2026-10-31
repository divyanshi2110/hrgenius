package com.hrgenius.modules.attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String designationTitle;
    private LocalDate attendanceDate;
    private String status;
    private String checkInTime;
    private String checkOutTime;
    private Double workHours;
    private String remarks;
    private LocalDateTime createdAt;

    public static AttendanceResponse fromEntity(Attendance a) {
        if (a == null) return null;

        AttendanceResponseBuilder builder = AttendanceResponse.builder()
                .id(a.getId())
                .attendanceDate(a.getAttendanceDate())
                .status(a.getStatus())
                .checkInTime(a.getCheckInTime())
                .checkOutTime(a.getCheckOutTime())
                .workHours(a.getWorkHours())
                .remarks(a.getRemarks())
                .createdAt(a.getCreatedAt());

        if (a.getEmployee() != null) {
            builder.employeeId(a.getEmployee().getId())
                    .employeeCode(a.getEmployee().getEmployeeCode())
                    .employeeName(a.getEmployee().getFullName());

            if (a.getEmployee().getDepartment() != null) {
                builder.departmentName(a.getEmployee().getDepartment().getDeptName());
            }
            if (a.getEmployee().getDesignation() != null) {
                builder.designationTitle(a.getEmployee().getDesignation().getTitle());
            }
        }

        return builder.build();
    }
}
