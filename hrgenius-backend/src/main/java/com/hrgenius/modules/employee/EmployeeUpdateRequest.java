package com.hrgenius.modules.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid corporate email")
    private String email;

    private String phone;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Designation is required")
    private Long designationId;

    private Long managerId;

    private String status;
}
