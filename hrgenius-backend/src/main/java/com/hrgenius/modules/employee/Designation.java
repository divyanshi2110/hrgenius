package com.hrgenius.modules.employee;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "designations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "desig_seq_gen")
    @SequenceGenerator(name = "desig_seq_gen", sequenceName = "desig_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "band_level", length = 20)
    private String bandLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Integer isActive = 1;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
