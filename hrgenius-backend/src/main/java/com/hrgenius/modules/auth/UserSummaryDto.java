package com.hrgenius.modules.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Long employeeId;
    private String employeeCode;
    private String fullName;
    private String departmentName;
    private String designationTitle;
}
