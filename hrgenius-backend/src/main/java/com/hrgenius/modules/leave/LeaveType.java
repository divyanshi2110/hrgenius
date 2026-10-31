package com.hrgenius.modules.leave;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leave_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "leave_type_seq_gen")
    @SequenceGenerator(name = "leave_type_seq_gen", sequenceName = "leave_type_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "annual_allocation", nullable = false)
    private Integer annualAllocation;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Integer isActive = 1;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
