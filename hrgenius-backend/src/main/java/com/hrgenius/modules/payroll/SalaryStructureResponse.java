package com.hrgenius.modules.payroll;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryStructureResponse {
    private Long id;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String designationTitle;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal specialAllowance;
    private BigDecimal conveyanceAllowance;
    private BigDecimal grossSalary;
    private BigDecimal epfDeduction;
    private BigDecimal professionalTax;
    private BigDecimal tdsDeduction;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private String bankName;
    private String bankAccountNo;
    private String bankIfsc;
    private String panNumber;
    private LocalDateTime updatedAt;
}
