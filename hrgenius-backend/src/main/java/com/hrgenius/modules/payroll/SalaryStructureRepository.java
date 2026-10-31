package com.hrgenius.modules.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryStructureRepository extends JpaRepository<SalaryStructure, Long> {

    @Query("SELECT s FROM SalaryStructure s " +
           "JOIN FETCH s.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "WHERE e.id = :employeeId")
    Optional<SalaryStructure> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT s FROM SalaryStructure s " +
           "JOIN FETCH s.employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "ORDER BY e.firstName ASC")
    List<SalaryStructure> findAllWithEmployee();
}
