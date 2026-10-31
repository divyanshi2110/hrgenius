package com.hrgenius.modules.leave;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    Optional<LeaveType> findByNameIgnoreCase(String name);

    @Query("SELECT CASE WHEN COUNT(lt) > 0 THEN true ELSE false END FROM LeaveType lt WHERE LOWER(lt.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(@Param("name") String name);

    List<LeaveType> findByIsActiveOrderByIdAsc(Integer isActive);
}
