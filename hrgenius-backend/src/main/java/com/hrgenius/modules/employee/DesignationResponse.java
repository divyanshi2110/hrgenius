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
public class DesignationResponse {
    private Long id;
    private String title;
    private String bandLevel;
    private Long departmentId;
    private String departmentName;
    private Integer isActive;
    private LocalDateTime createdAt;

    public static DesignationResponse fromEntity(Designation desig) {
        return DesignationResponse.builder()
                .id(desig.getId())
                .title(desig.getTitle())
                .bandLevel(desig.getBandLevel())
                .departmentId(desig.getDepartment() != null ? desig.getDepartment().getId() : null)
                .departmentName(desig.getDepartment() != null ? desig.getDepartment().getDeptName() : null)
                .isActive(desig.getIsActive())
                .createdAt(desig.getCreatedAt())
                .build();
    }
}
