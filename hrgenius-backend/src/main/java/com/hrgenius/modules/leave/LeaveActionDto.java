package com.hrgenius.modules.leave;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveActionDto {

    private Long approverEmployeeId;
    private String rejectionReason;
}
