package com.ripplenexus.salespilot.lead.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "icps")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdealCustomerProfile extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "industry")
    private String industry;

    @Column(name = "company_size_min")
    private Integer companySizeMin;

    @Column(name = "company_size_max")
    private Integer companySizeMax;

    @Column(name = "revenue_min", precision = 15, scale = 2)
    private BigDecimal revenueMin;

    @Column(name = "revenue_max", precision = 15, scale = 2)
    private BigDecimal revenueMax;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "decision_makers")
    private List<String> decisionMakers;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "pain_points")
    private List<String> painPoints;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "interested_services")
    private List<String> interestedServices;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private IcpPriority priority = IcpPriority.MEDIUM;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    public enum IcpPriority {
        LOW, MEDIUM, HIGH, URGENT
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public Integer getCompanySizeMin() { return companySizeMin; }
    public void setCompanySizeMin(Integer companySizeMin) { this.companySizeMin = companySizeMin; }
    public Integer getCompanySizeMax() { return companySizeMax; }
    public void setCompanySizeMax(Integer companySizeMax) { this.companySizeMax = companySizeMax; }
    public BigDecimal getRevenueMin() { return revenueMin; }
    public void setRevenueMin(BigDecimal revenueMin) { this.revenueMin = revenueMin; }
    public BigDecimal getRevenueMax() { return revenueMax; }
    public void setRevenueMax(BigDecimal revenueMax) { this.revenueMax = revenueMax; }
    public List<String> getDecisionMakers() { return decisionMakers; }
    public void setDecisionMakers(List<String> decisionMakers) { this.decisionMakers = decisionMakers; }
    public List<String> getPainPoints() { return painPoints; }
    public void setPainPoints(List<String> painPoints) { this.painPoints = painPoints; }
    public List<String> getInterestedServices() { return interestedServices; }
    public void setInterestedServices(List<String> interestedServices) { this.interestedServices = interestedServices; }
    public IcpPriority getPriority() { return priority; }
    public void setPriority(IcpPriority priority) { this.priority = priority; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
