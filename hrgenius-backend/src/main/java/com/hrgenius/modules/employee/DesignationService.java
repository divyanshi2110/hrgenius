package com.hrgenius.modules.employee;

import com.hrgenius.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DesignationService {

    private final DesignationRepository designationRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DesignationResponse> getAllDesignations(Long departmentId) {
        List<Designation> list;
        if (departmentId != null) {
            list = designationRepository.findByDepartmentIdAndIsActive(departmentId, 1);
        } else {
            list = designationRepository.findByIsActiveOrderByIdAsc(1);
        }
        return list.stream()
                .map(DesignationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DesignationResponse getDesignationById(Long id) {
        Designation desig = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", id));
        return DesignationResponse.fromEntity(desig);
    }

    @Transactional
    public DesignationResponse createDesignation(DesignationRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        Designation designation = Designation.builder()
                .title(request.getTitle().trim())
                .bandLevel(request.getBandLevel())
                .department(department)
                .isActive(1)
                .build();

        Designation saved = designationRepository.save(designation);
        return DesignationResponse.fromEntity(saved);
    }

    @Transactional
    public DesignationResponse updateDesignation(Long id, DesignationRequest request) {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        designation.setTitle(request.getTitle().trim());
        designation.setBandLevel(request.getBandLevel());
        designation.setDepartment(department);

        Designation updated = designationRepository.save(designation);
        return DesignationResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteDesignation(Long id) {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", id));
        designation.setIsActive(0);
        designationRepository.save(designation);
    }
}
