package com.ripplenexus.salespilot.incentive.presentation.dto;

import com.ripplenexus.salespilot.incentive.domain.Incentive;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class IncentiveDto {
    private UUID id;
    private String title;
    private String description;
    private String targetType;
    private BigDecimal targetValue;
    private BigDecimal rewardAmount;
    private String badgeName;
    private String badgeIcon;
    private String status;

    public static IncentiveDto from(Incentive incentive) {
        return IncentiveDto.builder()
                .id(incentive.getId())
                .title(incentive.getTitle())
                .description(incentive.getDescription())
                .targetType(incentive.getTargetType().name())
                .targetValue(incentive.getTargetValue())
                .rewardAmount(incentive.getRewardAmount())
                .badgeName(incentive.getBadgeName())
                .badgeIcon(incentive.getBadgeIcon())
                .status(incentive.getStatus().name())
                .build();
    }
}
