package com.hrgenius.modules.employee;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DesignationRequest {

    @NotBlank(message = "Designation title is required")
    @Size(min = 2, max = 100, message = "Designation title must be between 2 and 100 characters")
    private String title;

    private String bandLevel;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
}
