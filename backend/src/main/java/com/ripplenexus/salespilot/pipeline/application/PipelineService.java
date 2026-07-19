package com.ripplenexus.salespilot.pipeline.application;

import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import com.ripplenexus.salespilot.pipeline.domain.PipelineEntry;
import com.ripplenexus.salespilot.pipeline.domain.PipelineStage;
import com.ripplenexus.salespilot.pipeline.infrastructure.PipelineEntryRepository;
import com.ripplenexus.salespilot.pipeline.infrastructure.PipelineStageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PipelineService {

    private final PipelineStageRepository stageRepository;
    private final PipelineEntryRepository entryRepository;
    private final LeadRepository leadRepository;

    public List<PipelineStage> getStages() {
        return stageRepository.findAllByDeletedAtIsNullOrderByPositionAsc();
    }

    public List<PipelineEntry> getEntries() {
        return entryRepository.findByDeletedAtIsNull();
    }

    public void updateLeadStage(UUID leadId, UUID newStageId, int newPosition) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", leadId));
        
        PipelineStage stage = stageRepository.findById(newStageId)
                .orElseThrow(() -> new ResourceNotFoundException("Stage", newStageId));

        PipelineEntry entry = entryRepository.findByDeletedAtIsNull().stream()
                .filter(e -> e.getLead().getId().equals(leadId))
                .findFirst()
                .orElseGet(() -> PipelineEntry.builder()
                        .lead(lead)
                        .enteredStageAt(Instant.now())
                        .build());

        entry.setStage(stage);
        entry.setPositionInStage(newPosition);
        entry.setEnteredStageAt(Instant.now());
        
        // Update lead status based on system stage if applicable
        if (stage.getName().equalsIgnoreCase("WON")) {
            lead.setStatus(Lead.LeadStatus.WON);
        } else if (stage.getName().equalsIgnoreCase("LOST")) {
            lead.setStatus(Lead.LeadStatus.LOST);
        } else if (stage.getName().equalsIgnoreCase("PROPOSAL")) {
            lead.setStatus(Lead.LeadStatus.PROPOSAL_SENT);
        }
        
        leadRepository.save(lead);
        entryRepository.save(entry);
    }
}
