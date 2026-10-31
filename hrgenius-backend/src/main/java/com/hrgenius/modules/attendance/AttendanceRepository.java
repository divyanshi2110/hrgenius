package com.hrgenius.modules.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Attendance a " +
           "WHERE a.employee.id = :employeeId AND a.attendanceDate = :date")
    boolean existsByEmployeeIdAndAttendanceDate(@Param("employeeId") Long employeeId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a " +
           "JOIN FETCH a.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "WHERE (:employeeId IS NULL OR e.id = :employeeId) " +
           "  AND (:departmentId IS NULL OR e.department.id = :departmentId) " +
           "  AND (:status IS NULL OR a.status = :status) " +
           "  AND (:attendanceDate IS NULL OR a.attendanceDate = :attendanceDate) " +
           "  AND (:startDate IS NULL OR a.attendanceDate >= :startDate) " +
           "  AND (:endDate IS NULL OR a.attendanceDate <= :endDate) " +
           "ORDER BY a.attendanceDate DESC, e.firstName ASC")
    List<Attendance> searchAndFilter(
            @Param("employeeId") Long employeeId,
            @Param("departmentId") Long departmentId,
            @Param("status") String status,
            @Param("attendanceDate") LocalDate attendanceDate,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Long employeeId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.status IN ('PRESENT', 'WORK_FROM_HOME', 'HALF_DAY')")
    long countPresentOnDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.status = 'ON_LEAVE'")
    long countOnLeaveOnDate(@Param("date") LocalDate date);
}
