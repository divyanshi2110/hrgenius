package com.hrgenius.modules.employee;

import com.hrgenius.common.exception.ApiException;
import com.hrgenius.common.exception.ResourceNotFoundException;
import com.hrgenius.modules.auth.User;
import com.hrgenius.modules.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<EmployeeResponse> searchAndFilter(String keyword, Long departmentId, String status) {
        String trimmedKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String trimmedStatus = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : null;

        return employeeRepository.searchAndFilter(trimmedKeyword, departmentId, trimmedStatus).stream()
                .map(EmployeeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return EmployeeResponse.fromEntity(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeSummaryResponse> getActiveManagers() {
        return employeeRepository.findActiveManagers().stream()
                .map(EmployeeSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new ApiException("Employee with email '" + request.getEmail() + "' already exists", HttpStatus.CONFLICT);
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        Designation designation = designationRepository.findById(request.getDesignationId())
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", request.getDesignationId()));

        Employee manager = null;
        if (request.getManagerId() != null) {
            manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reporting Manager", "id", request.getManagerId()));
        }

        String employeeCode = generateNextEmployeeCode();

        User user = null;
        if (request.isCreateUserAccount()) {
            String username = request.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
            int suffix = 1;
            String originalUsername = username;
            while (userRepository.existsByUsername(username)) {
                username = originalUsername + suffix++;
            }

            user = User.builder()
                    .username(username)
                    .email(request.getEmail().trim().toLowerCase())
                    .password(passwordEncoder.encode("Welcome@123"))
                    .role(request.getRole() != null ? request.getRole() : "ROLE_EMPLOYEE")
                    .isActive(1)
                    .build();

            user = userRepository.save(user);
        }

        Employee employee = Employee.builder()
                .employeeCode(employeeCode)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone())
                .hireDate(request.getHireDate())
                .department(department)
                .designation(designation)
                .reportingManager(manager)
                .user(user)
                .status("ACTIVE")
                .build();

        Employee saved = employeeRepository.save(employee);
        log.info("Created new employee: {} ({})", saved.getFullName(), saved.getEmployeeCode());
        return EmployeeResponse.fromEntity(saved);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!employee.getEmail().equalsIgnoreCase(newEmail) && employeeRepository.existsByEmail(newEmail)) {
            throw new ApiException("Email '" + newEmail + "' is already registered to another employee", HttpStatus.CONFLICT);
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        Designation designation = designationRepository.findById(request.getDesignationId())
                .orElseThrow(() -> new ResourceNotFoundException("Designation", "id", request.getDesignationId()));

        Employee manager = null;
        if (request.getManagerId() != null) {
            if (request.getManagerId().equals(id)) {
                throw new ApiException("An employee cannot report to themselves", HttpStatus.BAD_REQUEST);
            }
            manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reporting Manager", "id", request.getManagerId()));
        }

        employee.setFirstName(request.getFirstName().trim());
        employee.setLastName(request.getLastName().trim());
        employee.setEmail(newEmail);
        employee.setPhone(request.getPhone());
        employee.setHireDate(request.getHireDate());
        employee.setDepartment(department);
        employee.setDesignation(designation);
        employee.setReportingManager(manager);

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            employee.setStatus(request.getStatus().trim().toUpperCase());
        }

        Employee updated = employeeRepository.save(employee);
        log.info("Updated employee: {} ({})", updated.getFullName(), updated.getEmployeeCode());
        return EmployeeResponse.fromEntity(updated);
    }

    @Transactional
    public EmployeeResponse toggleStatus(Long id, String status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        String newStatus = status != null ? status.trim().toUpperCase() : "INACTIVE";
        employee.setStatus(newStatus);

        if (employee.getUser() != null) {
            employee.getUser().setIsActive("ACTIVE".equals(newStatus) ? 1 : 0);
            userRepository.save(employee.getUser());
        }

        Employee updated = employeeRepository.save(employee);
        log.info("Toggled employee status for {} to {}", employee.getEmployeeCode(), newStatus);
        return EmployeeResponse.fromEntity(updated);
    }

    private synchronized String generateNextEmployeeCode() {
        long count = employeeRepository.count() + 1;
        String code = String.format("EMP-%03d", count);
        while (employeeRepository.existsByEmployeeCode(code)) {
            count++;
            code = String.format("EMP-%03d", count);
        }
        return code;
    }
}
