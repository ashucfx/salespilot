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

    public IncentiveDto() {}

    public IncentiveDto(UUID id, String title, String description, String targetType, BigDecimal targetValue, BigDecimal rewardAmount, String badgeName, String badgeIcon, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.targetType = targetType;
        this.targetValue = targetValue;
        this.rewardAmount = rewardAmount;
        this.badgeName = badgeName;
        this.badgeIcon = badgeIcon;
        this.status = status;
    }

    public static IncentiveDto from(Incentive incentive) {
        return new IncentiveDto(
                incentive.getId(),
                incentive.getTitle(),
                incentive.getDescription(),
                incentive.getTargetType() != null ? incentive.getTargetType().name() : null,
                incentive.getTargetValue(),
                incentive.getRewardAmount(),
                incentive.getBadgeName(),
                incentive.getBadgeIcon(),
                incentive.getStatus() != null ? incentive.getStatus().name() : null
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public BigDecimal getTargetValue() { return targetValue; }
    public void setTargetValue(BigDecimal targetValue) { this.targetValue = targetValue; }
    public BigDecimal getRewardAmount() { return rewardAmount; }
    public void setRewardAmount(BigDecimal rewardAmount) { this.rewardAmount = rewardAmount; }
    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
