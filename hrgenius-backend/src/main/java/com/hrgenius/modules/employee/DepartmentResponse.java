package com.hrgenius.modules.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String deptCode;
    private String deptName;
    private String description;
    private Integer isActive;
    private LocalDateTime createdAt;

    public static DepartmentResponse fromEntity(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .deptCode(dept.getDeptCode())
                .deptName(dept.getDeptName())
                .description(dept.getDescription())
                .isActive(dept.getIsActive())
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
