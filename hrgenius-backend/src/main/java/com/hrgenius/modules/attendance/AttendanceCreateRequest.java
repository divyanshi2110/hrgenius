package com.hrgenius.modules.attendance;

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
public class AttendanceCreateRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotBlank(message = "Status is required")
    private String status; // PRESENT, ABSENT, WORK_FROM_HOME, HALF_DAY, ON_LEAVE

    private String checkInTime; // HH:mm

    private String checkOutTime; // HH:mm

    private String remarks;
}
