package com.ripplenexus.salespilot.pipeline.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pipeline_stages")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PipelineStage extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "color", nullable = false)
    @Builder.Default
    private String color = "#6366f1";

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "description")
    private String description;

    @Column(name = "is_won_stage", nullable = false)
    @Builder.Default
    private Boolean isWonStage = false;

    @Column(name = "is_lost_stage", nullable = false)
    @Builder.Default
    private Boolean isLostStage = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
