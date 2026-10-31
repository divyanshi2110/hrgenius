package com.hrgenius.modules.leave;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    @Query("SELECT CASE WHEN COUNT(lr) > 0 THEN true ELSE false END FROM LeaveRequest lr " +
           "WHERE lr.employee.id = :employeeId " +
           "  AND lr.status IN ('PENDING', 'APPROVED') " +
           "  AND lr.startDate <= :endDate " +
           "  AND lr.endDate >= :startDate")
    boolean existsOverlappingLeave(
            @Param("employeeId") Long employeeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(lr.totalDays), 0) FROM LeaveRequest lr " +
           "WHERE lr.employee.id = :employeeId " +
           "  AND lr.leaveType.id = :leaveTypeId " +
           "  AND lr.status = 'APPROVED' " +
           "  AND lr.startDate >= :yearStart " +
           "  AND lr.startDate <= :yearEnd")
    Long sumApprovedDaysInYear(
            @Param("employeeId") Long employeeId,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("yearStart") LocalDate yearStart,
            @Param("yearEnd") LocalDate yearEnd
    );

    @Query("SELECT lr FROM LeaveRequest lr " +
           "JOIN FETCH lr.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "JOIN FETCH lr.leaveType " +
           "LEFT JOIN FETCH lr.approvedBy " +
           "WHERE (:employeeId IS NULL OR e.id = :employeeId) " +
           "  AND (:departmentId IS NULL OR e.department.id = :departmentId) " +
           "  AND (:status IS NULL OR lr.status = :status) " +
           "  AND (:leaveTypeId IS NULL OR lr.leaveType.id = :leaveTypeId) " +
           "  AND (:startDate IS NULL OR lr.startDate >= :startDate) " +
           "  AND (:endDate IS NULL OR lr.endDate <= :endDate) " +
           "ORDER BY lr.createdAt DESC")
    List<LeaveRequest> searchAndFilter(
            @Param("employeeId") Long employeeId,
            @Param("departmentId") Long departmentId,
            @Param("status") String status,
            @Param("leaveTypeId") Long leaveTypeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT lr FROM LeaveRequest lr " +
           "JOIN FETCH lr.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "JOIN FETCH lr.leaveType " +
           "LEFT JOIN FETCH lr.approvedBy " +
           "WHERE e.reportingManager.id = :managerId " +
           "ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findTeamLeaveRequests(@Param("managerId") Long managerId);

    @Query("SELECT lr FROM LeaveRequest lr " +
           "JOIN FETCH lr.employee e " +
           "JOIN FETCH lr.leaveType " +
           "LEFT JOIN FETCH lr.approvedBy " +
           "WHERE e.id = :employeeId " +
           "ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'PENDING'")
    long countPendingRequests();
}
