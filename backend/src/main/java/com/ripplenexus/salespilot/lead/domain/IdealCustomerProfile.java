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

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "industry_focus")
    private String industryFocus;

    @Column(name = "company_size_min")
    private Integer companySizeMin;

    @Column(name = "company_size_max")
    private Integer companySizeMax;

    @Column(name = "revenue_min")
    private String revenueMin;

    @Column(name = "target_regions")
    private String targetRegions;

    @Column(name = "key_pain_points", columnDefinition = "TEXT")
    private String keyPainPoints;
}
