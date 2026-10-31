package com.hrgenius.modules.employee;

import com.hrgenius.common.exception.ApiException;
import com.hrgenius.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getActiveDepartments() {
        return departmentRepository.findByIsActiveOrderByIdAsc(1).stream()
                .map(DepartmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return DepartmentResponse.fromEntity(dept);
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByDeptCode(request.getDeptCode().trim().toUpperCase())) {
            throw new ApiException("Department with code '" + request.getDeptCode() + "' already exists", HttpStatus.CONFLICT);
        }

        Department department = Department.builder()
                .deptCode(request.getDeptCode().trim().toUpperCase())
                .deptName(request.getDeptName().trim())
                .description(request.getDescription())
                .isActive(1)
                .build();

        Department saved = departmentRepository.save(department);
        return DepartmentResponse.fromEntity(saved);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        String newCode = request.getDeptCode().trim().toUpperCase();
        if (!department.getDeptCode().equalsIgnoreCase(newCode) && departmentRepository.existsByDeptCode(newCode)) {
            throw new ApiException("Department code '" + newCode + "' is already in use", HttpStatus.CONFLICT);
        }

        department.setDeptCode(newCode);
        department.setDeptName(request.getDeptName().trim());
        department.setDescription(request.getDescription());

        Department updated = departmentRepository.save(department);
        return DepartmentResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        department.setIsActive(0);
        departmentRepository.save(department);
    }
}
