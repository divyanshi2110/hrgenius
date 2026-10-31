package com.hrgenius.modules.leave;

import com.hrgenius.common.exception.ApiException;
import com.hrgenius.common.exception.ResourceNotFoundException;
import com.hrgenius.modules.attendance.Attendance;
import com.hrgenius.modules.attendance.AttendanceRepository;
import com.hrgenius.modules.employee.Employee;
import com.hrgenius.modules.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;

    // ==========================================
    // LEAVE TYPES
    // ==========================================

    @Transactional(readOnly = true)
    public List<LeaveTypeResponse> getAllLeaveTypes(boolean activeOnly) {
        List<LeaveType> types = activeOnly
                ? leaveTypeRepository.findByIsActiveOrderByIdAsc(1)
                : leaveTypeRepository.findAll();

        return types.stream()
                .map(LeaveTypeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveTypeResponse getLeaveTypeById(Long id) {
        LeaveType lt = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Type", "id", id));
        return LeaveTypeResponse.fromEntity(lt);
    }

    @Transactional
    public LeaveTypeResponse createLeaveType(LeaveTypeRequest request) {
        if (leaveTypeRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ApiException("Leave type with name '" + request.getName() + "' already exists", HttpStatus.CONFLICT);
        }

        LeaveType lt = LeaveType.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .annualAllocation(request.getAnnualAllocation())
                .isActive(request.getIsActive() != null ? request.getIsActive() : 1)
                .build();

        LeaveType saved = leaveTypeRepository.save(lt);
        log.info("Created leave type {} with {} days allocation", saved.getName(), saved.getAnnualAllocation());
        return LeaveTypeResponse.fromEntity(saved);
    }

    @Transactional
    public LeaveTypeResponse updateLeaveType(Long id, LeaveTypeRequest request) {
        LeaveType lt = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Type", "id", id));

        if (!lt.getName().equalsIgnoreCase(request.getName().trim()) &&
            leaveTypeRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ApiException("Leave type with name '" + request.getName() + "' already exists", HttpStatus.CONFLICT);
        }

        lt.setName(request.getName().trim());
        lt.setDescription(request.getDescription());
        lt.setAnnualAllocation(request.getAnnualAllocation());
        if (request.getIsActive() != null) {
            lt.setIsActive(request.getIsActive());
        }

        LeaveType updated = leaveTypeRepository.save(lt);
        log.info("Updated leave type ID {}", updated.getId());
        return LeaveTypeResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteLeaveType(Long id) {
        LeaveType lt = leaveTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Type", "id", id));

        // Soft delete to preserve historical integrity
        lt.setIsActive(0);
        leaveTypeRepository.save(lt);
        log.info("Deactivated leave type ID {}", id);
    }

    // ==========================================
    // LEAVE REQUESTS
    // ==========================================

    @Transactional(readOnly = true)
    public List<LeaveResponse> searchAndFilter(
            Long employeeId,
            Long departmentId,
            String status,
            Long leaveTypeId,
            LocalDate startDate,
            LocalDate endDate
    ) {
        String trimmedStatus = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : null;

        return leaveRequestRepository.searchAndFilter(employeeId, departmentId, trimmedStatus, leaveTypeId, startDate, endDate)
                .stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LeaveResponse getLeaveRequestById(Long id) {
        LeaveRequest lr = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Request", "id", id));
        return LeaveResponse.fromEntity(lr);
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getLeaveRequestsByEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee", "id", employeeId);
        }
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaveResponse> getTeamLeaveRequests(Long managerId) {
        if (!employeeRepository.existsById(managerId)) {
            throw new ResourceNotFoundException("Manager", "id", managerId);
        }
        return leaveRequestRepository.findTeamLeaveRequests(managerId).stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponse createLeaveRequest(LeaveRequestCreateDto dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", dto.getEmployeeId()));

        LeaveType leaveType = leaveTypeRepository.findById(dto.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave Type", "id", dto.getLeaveTypeId()));

        if (leaveType.getIsActive() == 0) {
            throw new ApiException("Cannot apply for inactive leave type: " + leaveType.getName(), HttpStatus.BAD_REQUEST);
        }

        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new ApiException("End date cannot be earlier than start date", HttpStatus.BAD_REQUEST);
        }

        int requestedDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate()) + 1;

        // Check for overlapping pending or approved leaves
        if (leaveRequestRepository.existsOverlappingLeave(employee.getId(), dto.getStartDate(), dto.getEndDate())) {
            throw new ApiException(
                    "You already have a PENDING or APPROVED leave request overlapping with the selected dates ("
                            + dto.getStartDate() + " to " + dto.getEndDate() + ").",
                    HttpStatus.CONFLICT
            );
        }

        // Check leave balance for current year
        int year = dto.getStartDate().getYear();
        LocalDate yearStart = LocalDate.of(year, 1, 1);
        LocalDate yearEnd = LocalDate.of(year, 12, 31);
        Long approvedDays = leaveRequestRepository.sumApprovedDaysInYear(employee.getId(), leaveType.getId(), yearStart, yearEnd);
        int remainingDays = leaveType.getAnnualAllocation() - approvedDays.intValue();

        if (requestedDays > remainingDays) {
            throw new ApiException(
                    String.format("Insufficient leave balance for %s. Allocation: %d, Used: %d, Remaining: %d, Requested: %d",
                            leaveType.getName(), leaveType.getAnnualAllocation(), approvedDays, remainingDays, requestedDays),
                    HttpStatus.BAD_REQUEST
            );
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .totalDays(requestedDays)
                .reason(dto.getReason())
                .status("PENDING")
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        log.info("Created leave request ID {} for employee {} ({} days)", saved.getId(), employee.getEmployeeCode(), requestedDays);
        return LeaveResponse.fromEntity(saved);
    }

    @Transactional
    public LeaveResponse approveLeaveRequest(Long id, Long approverEmployeeId) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Request", "id", id));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new ApiException("Only PENDING leave requests can be approved. Current status: " + request.getStatus(), HttpStatus.BAD_REQUEST);
        }

        Employee approver = null;
        if (approverEmployeeId != null) {
            if (request.getEmployee().getId().equals(approverEmployeeId)) {
                throw new ApiException("Employees cannot approve their own leave request", HttpStatus.FORBIDDEN);
            }
            approver = employeeRepository.findById(approverEmployeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Approver Employee", "id", approverEmployeeId));
        }

        // Re-verify balance at approval time
        int year = request.getStartDate().getYear();
        LocalDate yearStart = LocalDate.of(year, 1, 1);
        LocalDate yearEnd = LocalDate.of(year, 12, 31);
        Long approvedDays = leaveRequestRepository.sumApprovedDaysInYear(
                request.getEmployee().getId(), request.getLeaveType().getId(), yearStart, yearEnd);
        int remainingDays = request.getLeaveType().getAnnualAllocation() - approvedDays.intValue();

        if (request.getTotalDays() > remainingDays) {
            throw new ApiException(
                    String.format("Approval failed: Insufficient balance. Remaining: %d, Requested: %d",
                            remainingDays, request.getTotalDays()),
                    HttpStatus.BAD_REQUEST
            );
        }

        request.setStatus("APPROVED");
        request.setApprovedBy(approver);
        request.setApprovedAt(LocalDateTime.now());
        request.setRejectionReason(null);
        LeaveRequest updated = leaveRequestRepository.save(request);

        // Synchronize with Attendance records (mark as ON_LEAVE)
        for (LocalDate date = request.getStartDate(); !date.isAfter(request.getEndDate()); date = date.plusDays(1)) {
            Optional<Attendance> existingOpt = attendanceRepository.findByEmployeeIdAndAttendanceDate(request.getEmployee().getId(), date);
            if (existingOpt.isPresent()) {
                Attendance att = existingOpt.get();
                att.setStatus("ON_LEAVE");
                att.setWorkHours(0.0);
                att.setRemarks("Approved Leave: " + request.getLeaveType().getName());
                attendanceRepository.save(att);
            } else {
                Attendance att = Attendance.builder()
                        .employee(request.getEmployee())
                        .attendanceDate(date)
                        .status("ON_LEAVE")
                        .workHours(0.0)
                        .remarks("Approved Leave: " + request.getLeaveType().getName())
                        .build();
                attendanceRepository.save(att);
            }
        }

        log.info("Leave request ID {} APPROVED by employee {}", id, approver != null ? approver.getEmployeeCode() : "SYSTEM/ADMIN");
        return LeaveResponse.fromEntity(updated);
    }

    @Transactional
    public LeaveResponse rejectLeaveRequest(Long id, Long approverEmployeeId, String rejectionReason) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Request", "id", id));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new ApiException("Only PENDING leave requests can be rejected. Current status: " + request.getStatus(), HttpStatus.BAD_REQUEST);
        }

        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new ApiException("Rejection reason is required", HttpStatus.BAD_REQUEST);
        }

        Employee approver = null;
        if (approverEmployeeId != null) {
            if (request.getEmployee().getId().equals(approverEmployeeId)) {
                throw new ApiException("Employees cannot reject their own leave request", HttpStatus.FORBIDDEN);
            }
            approver = employeeRepository.findById(approverEmployeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Approver Employee", "id", approverEmployeeId));
        }

        request.setStatus("REJECTED");
        request.setApprovedBy(approver);
        request.setApprovedAt(LocalDateTime.now());
        request.setRejectionReason(rejectionReason.trim());
        LeaveRequest updated = leaveRequestRepository.save(request);

        log.info("Leave request ID {} REJECTED by employee {}", id, approver != null ? approver.getEmployeeCode() : "SYSTEM/ADMIN");
        return LeaveResponse.fromEntity(updated);
    }

    @Transactional
    public LeaveResponse cancelLeaveRequest(Long id, Long employeeId) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave Request", "id", id));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new ApiException("Only PENDING leave requests can be cancelled. Current status: " + request.getStatus(), HttpStatus.BAD_REQUEST);
        }

        if (employeeId != null && !request.getEmployee().getId().equals(employeeId)) {
            throw new ApiException("You are not authorized to cancel this leave request", HttpStatus.FORBIDDEN);
        }

        request.setStatus("CANCELLED");
        LeaveRequest updated = leaveRequestRepository.save(request);
        log.info("Leave request ID {} CANCELLED by employee {}", id, employeeId);
        return LeaveResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<LeaveBalanceResponse> getLeaveBalances(Long employeeId, Integer year) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee", "id", employeeId);
        }

        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        LocalDate yearStart = LocalDate.of(targetYear, 1, 1);
        LocalDate yearEnd = LocalDate.of(targetYear, 12, 31);

        List<LeaveType> activeTypes = leaveTypeRepository.findByIsActiveOrderByIdAsc(1);
        List<LeaveBalanceResponse> balances = new ArrayList<>();

        for (LeaveType lt : activeTypes) {
            Long approvedDays = leaveRequestRepository.sumApprovedDaysInYear(employeeId, lt.getId(), yearStart, yearEnd);
            int used = approvedDays.intValue();
            int remaining = Math.max(0, lt.getAnnualAllocation() - used);

            balances.add(LeaveBalanceResponse.builder()
                    .leaveTypeId(lt.getId())
                    .leaveTypeName(lt.getName())
                    .annualAllocation(lt.getAnnualAllocation())
                    .usedDays(used)
                    .remainingDays(remaining)
                    .build());
        }

        return balances;
    }
}
