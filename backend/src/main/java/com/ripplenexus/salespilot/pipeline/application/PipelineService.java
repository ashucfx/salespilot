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
        return stageRepository.findAllByDeletedAtIsNullOrderByDisplayOrderAsc();
    }

    public List<PipelineEntry> getEntries(com.ripplenexus.salespilot.auth.domain.User currentUser) {
        List<PipelineEntry> allEntries = entryRepository.findAll();
        
        boolean isAdminOrManager = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("SALES_MANAGER"));
                
        if (isAdminOrManager) {
            return allEntries;
        }
        
        // SALES_EXEC only sees their own assigned leads
        return allEntries.stream()
                .filter(e -> e.getLead().getAssignedTo() != null 
                        && e.getLead().getAssignedTo().getUser().getId().equals(currentUser.getId()))
                .toList();
    }

    public PipelineEntryDto updateLeadStage(UUID leadId, UUID newStageId, int position, com.ripplenexus.salespilot.auth.domain.User currentUser) {
        Lead lead = leadRepository.findById(leadId)
                .filter(l -> l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", leadId));

        boolean isAdminOrManager = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("SALES_MANAGER"));
                
        if (!isAdminOrManager) {
            Employee emp = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
            if (lead.getAssignedTo() == null || !lead.getAssignedTo().getId().equals(emp.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Access denied. You can only move your own assigned leads.");
            }
        }

        PipelineStage stage = stageRepository.findById(newStageId)
                .orElseThrow(() -> new ResourceNotFoundException("Stage", newStageId));

        PipelineEntry entry = entryRepository.findByLeadId(leadId)
                .orElseGet(() -> PipelineEntry.builder()
                        .lead(lead)
                        .enteredAt(Instant.now())
                        .build());

        entry.setStage(stage);
        entry.setPosition(position);
        entry.setEnteredAt(Instant.now());
        
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
