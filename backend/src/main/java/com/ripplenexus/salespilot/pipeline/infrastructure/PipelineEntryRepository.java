package com.ripplenexus.salespilot.pipeline.infrastructure;

import com.ripplenexus.salespilot.pipeline.domain.PipelineEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PipelineEntryRepository extends JpaRepository<PipelineEntry, UUID> {
    List<PipelineEntry> findByStageIdOrderByPositionAsc(UUID stageId);
    java.util.Optional<PipelineEntry> findByLeadId(UUID leadId);
}
