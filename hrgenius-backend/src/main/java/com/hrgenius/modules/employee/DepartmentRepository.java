package com.hrgenius.modules.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDeptCode(String deptCode);

    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Department d WHERE UPPER(d.deptCode) = UPPER(:deptCode)")
    boolean existsByDeptCode(@Param("deptCode") String deptCode);

    List<Department> findByIsActiveOrderByIdAsc(Integer isActive);
}
