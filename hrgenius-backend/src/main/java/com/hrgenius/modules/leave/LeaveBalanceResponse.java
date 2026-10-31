package com.hrgenius.modules.leave;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveBalanceResponse {

    private Long leaveTypeId;
    private String leaveTypeName;
    private Integer annualAllocation;
    private Integer usedDays;
    private Integer pendingDays;
    private Integer remainingDays;
}
