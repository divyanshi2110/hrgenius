package com.hrgenius.modules.leave;

import jakarta.validation.constraints.Min;
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
public class LeaveTypeRequest {

    @NotBlank(message = "Leave type name is required")
    @Size(max = 100, message = "Leave type name cannot exceed 100 characters")
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Annual allocation is required")
    @Min(value = 1, message = "Annual allocation must be at least 1 day")
    private Integer annualAllocation;

    @Builder.Default
    private Integer isActive = 1;
}
