package com.hrgenius.modules.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {
    List<Designation> findByDepartmentIdAndIsActive(Long departmentId, Integer isActive);
    List<Designation> findByIsActiveOrderByIdAsc(Integer isActive);
}
