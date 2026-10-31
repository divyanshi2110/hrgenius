package com.hrgenius.modules.payroll;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollProcessRequest {
    private Long employeeId; // if null, process for all active employees

    @NotNull(message = "Pay month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer payMonth;

    @NotNull(message = "Pay year is required")
    private Integer payYear;

    private Integer totalWorkingDays; // optional override, default 30
    private BigDecimal customLopDays; // optional override
}
