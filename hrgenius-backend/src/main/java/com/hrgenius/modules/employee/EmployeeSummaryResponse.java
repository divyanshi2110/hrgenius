package com.hrgenius.modules.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSummaryResponse {
    private Long id;
    private String employeeCode;
    private String fullName;
    private String departmentName;
    private String designationTitle;

    public static EmployeeSummaryResponse fromEntity(Employee emp) {
        return EmployeeSummaryResponse.builder()
                .id(emp.getId())
                .employeeCode(emp.getEmployeeCode())
                .fullName(emp.getFullName())
                .departmentName(emp.getDepartment() != null ? emp.getDepartment().getDeptName() : "")
                .designationTitle(emp.getDesignation() != null ? emp.getDesignation().getTitle() : "")
                .build();
    }
}
