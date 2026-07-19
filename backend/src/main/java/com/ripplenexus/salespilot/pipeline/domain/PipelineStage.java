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

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "position", nullable = false)
    private Integer position;

    @Column(name = "description")
    private String description;

    @Column(name = "is_system_stage", nullable = false)
    private boolean isSystemStage = false;
}
