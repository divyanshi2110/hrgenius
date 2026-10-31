package com.hrgenius.modules.leave;

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
public class LeaveResponse {

    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String designationTitle;

    private Long leaveTypeId;
    private String leaveTypeName;

    private LocalDate startDate;
    private LocalDate endDate;
    private Integer totalDays;
    private String reason;
    private String status; // PENDING, APPROVED, REJECTED, CANCELLED

    private Long approvedById;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String rejectionReason;

    private LocalDateTime createdAt;

    public static LeaveResponse fromEntity(LeaveRequest lr) {
        if (lr == null) return null;

        LeaveResponseBuilder builder = LeaveResponse.builder()
                .id(lr.getId())
                .startDate(lr.getStartDate())
                .endDate(lr.getEndDate())
                .totalDays(lr.getTotalDays())
                .reason(lr.getReason())
                .status(lr.getStatus())
                .approvedAt(lr.getApprovedAt())
                .rejectionReason(lr.getRejectionReason())
                .createdAt(lr.getCreatedAt());

        if (lr.getEmployee() != null) {
            builder.employeeId(lr.getEmployee().getId())
                    .employeeCode(lr.getEmployee().getEmployeeCode())
                    .employeeName(lr.getEmployee().getFullName());

            if (lr.getEmployee().getDepartment() != null) {
                builder.departmentName(lr.getEmployee().getDepartment().getDeptName());
            }
            if (lr.getEmployee().getDesignation() != null) {
                builder.designationTitle(lr.getEmployee().getDesignation().getTitle());
            }
        }

        if (lr.getLeaveType() != null) {
            builder.leaveTypeId(lr.getLeaveType().getId())
                    .leaveTypeName(lr.getLeaveType().getName());
        }

        if (lr.getApprovedBy() != null) {
            builder.approvedById(lr.getApprovedBy().getId())
                    .approvedByName(lr.getApprovedBy().getFullName());
        }

        return builder.build();
    }
}
