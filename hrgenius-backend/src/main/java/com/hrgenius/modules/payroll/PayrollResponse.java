package com.hrgenius.modules.payroll;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponse {
    private Long id;
    private String payrollCode;
    private Long employeeId;
    private String employeeCode;
    private String employeeName;
    private String departmentName;
    private String designationTitle;
    private String panNumber;
    private String bankName;
    private String bankAccountNo;
    private String bankIfsc;
    private Integer payMonth;
    private Integer payYear;
    private Integer totalWorkingDays;
    private BigDecimal paidDays;
    private BigDecimal lopDays;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal specialAllowance;
    private BigDecimal conveyanceAllowance;
    private BigDecimal grossSalary;
    private BigDecimal epfDeduction;
    private BigDecimal professionalTax;
    private BigDecimal tdsDeduction;
    private BigDecimal lopDeduction;
    private BigDecimal totalDeductions;
    private BigDecimal netSalary;
    private String netSalaryInWords;
    private String status;
    private LocalDate paymentDate;
    private LocalDateTime createdAt;
}
