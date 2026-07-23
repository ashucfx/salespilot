package com.ripplenexus.salespilot.commission.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commission_rules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRule extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CommissionType type;

    @Column(name = "percentage", precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "fixed_amount", precision = 12, scale = 2)
    private BigDecimal fixedAmount;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("tierOrder ASC")
    @Builder.Default
    private List<CommissionTier> tiers = new ArrayList<>();

    public enum CommissionType {
        PERCENTAGE, FIXED, HYBRID, TIERED
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public CommissionType getType() { return type; }
    public void setType(CommissionType type) { this.type = type; }
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
    public BigDecimal getFixedAmount() { return fixedAmount; }
    public void setFixedAmount(BigDecimal fixedAmount) { this.fixedAmount = fixedAmount; }
    public List<CommissionTier> getTiers() { return tiers; }
    public void setTiers(List<CommissionTier> tiers) { this.tiers = tiers; }
}
