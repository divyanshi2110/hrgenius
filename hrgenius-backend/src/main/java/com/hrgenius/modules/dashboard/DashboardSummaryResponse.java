package com.hrgenius.modules.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long totalDepartments;
    private double todayAttendanceRate;
    private long todayPresentCount;
    private long todayOnLeaveCount;
    private long todayAbsentCount;
    private long pendingLeaveRequests;
}
