package com.hrgenius.modules.payroll;

import com.hrgenius.modules.employee.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payroll_seq_gen")
    @SequenceGenerator(name = "payroll_seq_gen", sequenceName = "payroll_seq", allocationSize = 1)
    private Long id;

    @Column(name = "payroll_code", nullable = false, unique = true, length = 50)
    private String payrollCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "pay_month", nullable = false)
    private Integer payMonth;

    @Column(name = "pay_year", nullable = false)
    private Integer payYear;

    @Column(name = "total_working_days", nullable = false)
    private Integer totalWorkingDays;

    @Column(name = "paid_days", nullable = false, precision = 5, scale = 1)
    private BigDecimal paidDays;

    @Column(name = "lop_days", nullable = false, precision = 5, scale = 1)
    @Builder.Default
    private BigDecimal lopDays = BigDecimal.ZERO;

    @Column(name = "basic_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal basicSalary;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal hra;

    @Column(name = "special_allowance", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal specialAllowance = BigDecimal.ZERO;

    @Column(name = "conveyance_allowance", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal conveyanceAllowance = BigDecimal.ZERO;

    @Column(name = "gross_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "epf_deduction", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal epfDeduction = BigDecimal.ZERO;

    @Column(name = "professional_tax", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal professionalTax = BigDecimal.ZERO;

    @Column(name = "tds_deduction", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal tdsDeduction = BigDecimal.ZERO;

    @Column(name = "lop_deduction", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal lopDeduction = BigDecimal.ZERO;

    @Column(name = "total_deductions", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDeductions;

    @Column(name = "net_salary", nullable = false, precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "GENERATED"; // DRAFT, GENERATED, PAID

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
