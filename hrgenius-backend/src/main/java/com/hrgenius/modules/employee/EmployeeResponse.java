package com.hrgenius.modules.employee;

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
public class EmployeeResponse {

    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate hireDate;
    private String status;

    private Long departmentId;
    private String departmentCode;
    private String departmentName;

    private Long designationId;
    private String designationTitle;
    private String bandLevel;

    private Long managerId;
    private String managerEmployeeCode;
    private String managerName;

    private Long userId;
    private String username;
    private String userRole;

    private LocalDateTime createdAt;

    public static EmployeeResponse fromEntity(Employee emp) {
        if (emp == null) return null;

        EmployeeResponseBuilder builder = EmployeeResponse.builder()
                .id(emp.getId())
                .employeeCode(emp.getEmployeeCode())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .fullName(emp.getFullName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .hireDate(emp.getHireDate())
                .status(emp.getStatus())
                .createdAt(emp.getCreatedAt());

        if (emp.getDepartment() != null) {
            builder.departmentId(emp.getDepartment().getId())
                    .departmentCode(emp.getDepartment().getDeptCode())
                    .departmentName(emp.getDepartment().getDeptName());
        }

        if (emp.getDesignation() != null) {
            builder.designationId(emp.getDesignation().getId())
                    .designationTitle(emp.getDesignation().getTitle())
                    .bandLevel(emp.getDesignation().getBandLevel());
        }

        if (emp.getReportingManager() != null) {
            builder.managerId(emp.getReportingManager().getId())
                    .managerEmployeeCode(emp.getReportingManager().getEmployeeCode())
                    .managerName(emp.getReportingManager().getFullName());
        }

        if (emp.getUser() != null) {
            builder.userId(emp.getUser().getId())
                    .username(emp.getUser().getUsername())
                    .userRole(emp.getUser().getRole());
        }

        return builder.build();
    }
}
