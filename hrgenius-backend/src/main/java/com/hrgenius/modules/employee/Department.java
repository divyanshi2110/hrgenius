package com.hrgenius.modules.employee;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dept_seq_gen")
    @SequenceGenerator(name = "dept_seq_gen", sequenceName = "dept_seq", allocationSize = 1)
    private Long id;

    @Column(name = "dept_code", nullable = false, unique = true, length = 20)
    private String deptCode;

    @Column(name = "dept_name", nullable = false, length = 100)
    private String deptName;

    @Column(length = 255)
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Integer isActive = 1;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
