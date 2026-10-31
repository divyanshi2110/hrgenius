package com.hrgenius.modules.attendance;

import com.hrgenius.common.exception.ApiException;
import com.hrgenius.common.exception.ResourceNotFoundException;
import com.hrgenius.modules.employee.Employee;
import com.hrgenius.modules.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional(readOnly = true)
    public List<AttendanceResponse> searchAndFilter(
            Long employeeId,
            Long departmentId,
            String status,
            LocalDate attendanceDate,
            LocalDate startDate,
            LocalDate endDate
    ) {
        String trimmedStatus = (status != null && !status.trim().isEmpty()) ? status.trim().toUpperCase() : null;

        return attendanceRepository.searchAndFilter(employeeId, departmentId, trimmedStatus, attendanceDate, startDate, endDate)
                .stream()
                .map(AttendanceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(Long id) {
        Attendance a = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record", "id", id));
        return AttendanceResponse.fromEntity(a);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceByEmployeeId(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee", "id", employeeId);
        }
        return attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employeeId).stream()
                .map(AttendanceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse recordAttendance(AttendanceCreateRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        if (attendanceRepository.existsByEmployeeIdAndAttendanceDate(request.getEmployeeId(), request.getAttendanceDate())) {
            throw new ApiException(
                    "Attendance record already exists for employee " + employee.getEmployeeCode() + " on " + request.getAttendanceDate(),
                    HttpStatus.CONFLICT
            );
        }

        String normalizedStatus = request.getStatus().trim().toUpperCase();
        Double calculatedHours = calculateWorkHours(normalizedStatus, request.getCheckInTime(), request.getCheckOutTime());

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .attendanceDate(request.getAttendanceDate())
                .status(normalizedStatus)
                .checkInTime(request.getCheckInTime() != null ? request.getCheckInTime().trim() : null)
                .checkOutTime(request.getCheckOutTime() != null ? request.getCheckOutTime().trim() : null)
                .workHours(calculatedHours)
                .remarks(request.getRemarks())
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        log.info("Recorded attendance ID {} for {} on {}", saved.getId(), employee.getEmployeeCode(), saved.getAttendanceDate());
        return AttendanceResponse.fromEntity(saved);
    }

    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceUpdateRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record", "id", id));

        String normalizedStatus = request.getStatus().trim().toUpperCase();
        Double calculatedHours = calculateWorkHours(normalizedStatus, request.getCheckInTime(), request.getCheckOutTime());

        attendance.setStatus(normalizedStatus);
        attendance.setCheckInTime(request.getCheckInTime() != null ? request.getCheckInTime().trim() : null);
        attendance.setCheckOutTime(request.getCheckOutTime() != null ? request.getCheckOutTime().trim() : null);
        attendance.setWorkHours(calculatedHours);
        attendance.setRemarks(request.getRemarks());

        Attendance updated = attendanceRepository.save(attendance);
        log.info("Updated attendance ID {} for {}", updated.getId(), updated.getEmployee().getEmployeeCode());
        return AttendanceResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record", "id", id);
        }
        attendanceRepository.deleteById(id);
    }

    private Double calculateWorkHours(String status, String checkIn, String checkOut) {
        if ("ABSENT".equals(status) || "ON_LEAVE".equals(status)) {
            return 0.0;
        }

        if (checkIn != null && !checkIn.trim().isEmpty() && checkOut != null && !checkOut.trim().isEmpty()) {
            try {
                LocalTime in = LocalTime.parse(checkIn.trim());
                LocalTime out = LocalTime.parse(checkOut.trim());

                if (out.isBefore(in)) {
                    throw new ApiException("Check-out time (" + checkOut + ") cannot be earlier than check-in time (" + checkIn + ")", HttpStatus.BAD_REQUEST);
                }

                long minutes = Duration.between(in, out).toMinutes();
                return Math.round((minutes / 60.0) * 100.0) / 100.0;
            } catch (DateTimeParseException e) {
                throw new ApiException("Invalid time format. Please provide HH:mm (e.g. 09:30)", HttpStatus.BAD_REQUEST);
            }
        }

        if ("HALF_DAY".equals(status)) {
            return 4.0;
        }

        return 8.0; // Default standard full work day
    }
}
