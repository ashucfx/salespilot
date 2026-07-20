package com.ripplenexus.salespilot.lead.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

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
    private java.math.BigDecimal revenueMin;

    @Column(name = "revenue_max", precision = 15, scale = 2)
    private java.math.BigDecimal revenueMax;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "decision_makers")
    private java.util.List<String> decisionMakers;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "pain_points")
    private java.util.List<String> painPoints;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "interested_services")
    private java.util.List<String> interestedServices;

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
}
