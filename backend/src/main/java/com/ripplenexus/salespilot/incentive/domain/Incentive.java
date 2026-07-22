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
}
