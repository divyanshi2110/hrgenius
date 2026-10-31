package com.hrgenius.modules.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByUserId(Long userId);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employee e WHERE LOWER(e.email) = LOWER(:email)")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employee e WHERE UPPER(e.employeeCode) = UPPER(:employeeCode)")
    boolean existsByEmployeeCode(@Param("employeeCode") String employeeCode);

    @Query("SELECT e FROM Employee e " +
           "LEFT JOIN FETCH e.department " +
           "LEFT JOIN FETCH e.designation " +
           "LEFT JOIN FETCH e.reportingManager " +
           "WHERE (:keyword IS NULL OR " +
           "       LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "  AND (:departmentId IS NULL OR e.department.id = :departmentId) " +
           "  AND (:status IS NULL OR e.status = :status) " +
           "ORDER BY e.id ASC")
    List<Employee> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("departmentId") Long departmentId,
            @Param("status") String status
    );

    @Query("SELECT e FROM Employee e WHERE e.status = 'ACTIVE' ORDER BY e.firstName ASC")
    List<Employee> findActiveManagers();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = :status")
    long countByStatus(@Param("status") String status);

    List<Employee> findByStatus(String status);
}
