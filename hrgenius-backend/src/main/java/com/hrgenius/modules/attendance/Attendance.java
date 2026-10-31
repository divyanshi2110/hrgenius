package com.hrgenius.modules.attendance;

import com.hrgenius.modules.employee.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
        @UniqueConstraint(name = "uk_att_emp_date", columnNames = {"employee_id", "attendance_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "attendance_seq_gen")
    @SequenceGenerator(name = "attendance_seq_gen", sequenceName = "attendance_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(nullable = false, length = 30)
    private String status; // PRESENT, ABSENT, WORK_FROM_HOME, HALF_DAY, ON_LEAVE

    @Column(name = "check_in_time", length = 10)
    private String checkInTime; // HH:mm

    @Column(name = "check_out_time", length = 10)
    private String checkOutTime; // HH:mm

    @Column(name = "work_hours")
    private Double workHours;

    @Column(length = 255)
    private String remarks;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
