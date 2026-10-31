package com.hrgenius.modules.payroll;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryStructureRequest {
    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Basic salary is required")
    @Positive(message = "Basic salary must be greater than zero")
    private BigDecimal basicSalary;

    @NotNull(message = "HRA is required")
    private BigDecimal hra;

    private BigDecimal specialAllowance;
    private BigDecimal conveyanceAllowance;
    private BigDecimal epfDeduction;
    private BigDecimal professionalTax;
    private BigDecimal tdsDeduction;

    private String bankName;
    private String bankAccountNo;
    private String bankIfsc;
    private String panNumber;
}
