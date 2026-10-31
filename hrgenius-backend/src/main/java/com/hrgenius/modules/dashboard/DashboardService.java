package com.hrgenius.modules.dashboard;

import com.hrgenius.modules.attendance.AttendanceRepository;
import com.hrgenius.modules.employee.DepartmentRepository;
import com.hrgenius.modules.employee.EmployeeRepository;
import com.hrgenius.modules.leave.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        LocalDate today = LocalDate.now();

        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countByStatus("ACTIVE");
        long totalDepartments = departmentRepository.count();

        long presentCount = attendanceRepository.countPresentOnDate(today);
        long onLeaveCount = attendanceRepository.countOnLeaveOnDate(today);
        long pendingLeaves = leaveRequestRepository.countPendingRequests();

        long absentCount = Math.max(0, activeEmployees - (presentCount + onLeaveCount));
        double attendanceRate = (activeEmployees > 0)
                ? Math.round(((double) presentCount / activeEmployees) * 1000.0) / 10.0
                : 0.0;

        return DashboardSummaryResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .totalDepartments(totalDepartments)
                .todayAttendanceRate(attendanceRate)
                .todayPresentCount(presentCount)
                .todayOnLeaveCount(onLeaveCount)
                .todayAbsentCount(absentCount)
                .pendingLeaveRequests(pendingLeaves)
                .build();
    }
}
