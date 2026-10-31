package com.hrgenius.modules.payroll;

import com.hrgenius.modules.employee.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_structures")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sal_struct_seq_gen")
    @SequenceGenerator(name = "sal_struct_seq_gen", sequenceName = "sal_struct_seq", allocationSize = 1)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

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

    @Column(name = "epf_deduction", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal epfDeduction = BigDecimal.ZERO;

    @Column(name = "professional_tax", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal professionalTax = BigDecimal.ZERO;

    @Column(name = "tds_deduction", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal tdsDeduction = BigDecimal.ZERO;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "bank_account_no", length = 50)
    private String bankAccountNo;

    @Column(name = "bank_ifsc", length = 30)
    private String bankIfsc;

    @Column(name = "pan_number", length = 20)
    private String panNumber;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
