package com.ripplenexus.salespilot.incentive.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "incentives")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Incentive extends BaseEntity {

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    @Column(name = "target_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal targetValue;

    @Column(name = "reward_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal rewardAmount;

    @Column(name = "badge_name")
    private String badgeName;

    @Column(name = "badge_icon")
    private String badgeIcon;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private Status status = Status.ACTIVE;

    public enum TargetType {
        DEAL_REVENUE,
        DEALS_CLOSED,
        LEADS_CONVERTED
    }

    public enum Status {
        ACTIVE,
        INACTIVE,
        EXPIRED
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }
    public BigDecimal getTargetValue() { return targetValue; }
    public void setTargetValue(BigDecimal targetValue) { this.targetValue = targetValue; }
    public BigDecimal getRewardAmount() { return rewardAmount; }
    public void setRewardAmount(BigDecimal rewardAmount) { this.rewardAmount = rewardAmount; }
    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
