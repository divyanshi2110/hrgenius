package com.hrgenius.modules.attendance;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String checkInTime;

    private String checkOutTime;

    private String remarks;
}
