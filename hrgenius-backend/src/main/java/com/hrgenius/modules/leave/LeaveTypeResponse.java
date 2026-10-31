package com.hrgenius.modules.leave;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveTypeResponse {

    private Long id;
    private String name;
    private String description;
    private Integer annualAllocation;
    private Integer isActive;
    private LocalDateTime createdAt;

    public static LeaveTypeResponse fromEntity(LeaveType lt) {
        if (lt == null) return null;
        return LeaveTypeResponse.builder()
                .id(lt.getId())
                .name(lt.getName())
                .description(lt.getDescription())
                .annualAllocation(lt.getAnnualAllocation())
                .isActive(lt.getIsActive())
                .createdAt(lt.getCreatedAt())
                .build();
    }
}
