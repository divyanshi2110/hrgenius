package com.hrgenius.modules.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    @Query("SELECT p FROM Payroll p " +
           "JOIN FETCH p.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "WHERE (:employeeId IS NULL OR e.id = :employeeId) " +
           "  AND (:month IS NULL OR p.payMonth = :month) " +
           "  AND (:year IS NULL OR p.payYear = :year) " +
           "  AND (:status IS NULL OR p.status = :status) " +
           "ORDER BY p.payYear DESC, p.payMonth DESC, e.firstName ASC")
    List<Payroll> searchAndFilter(
            @Param("employeeId") Long employeeId,
            @Param("month") Integer month,
            @Param("year") Integer year,
            @Param("status") String status
    );

    @Query("SELECT p FROM Payroll p " +
           "JOIN FETCH p.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "WHERE p.id = :id")
    Optional<Payroll> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT p FROM Payroll p " +
           "JOIN FETCH p.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "WHERE e.id = :employeeId " +
           "ORDER BY p.payYear DESC, p.payMonth DESC")
    List<Payroll> findByEmployeeId(@Param("employeeId") Long employeeId);

    Optional<Payroll> findByEmployeeIdAndPayMonthAndPayYear(Long employeeId, Integer payMonth, Integer payYear);
}
