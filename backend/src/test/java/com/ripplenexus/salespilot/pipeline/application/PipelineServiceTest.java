package com.ripplenexus.salespilot.pipeline.application;

import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import com.ripplenexus.salespilot.pipeline.domain.PipelineEntry;
import com.ripplenexus.salespilot.pipeline.domain.PipelineStage;
import com.ripplenexus.salespilot.pipeline.infrastructure.PipelineEntryRepository;
import com.ripplenexus.salespilot.pipeline.infrastructure.PipelineStageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PipelineServiceTest {

    @Mock private PipelineStageRepository stageRepository;
    @Mock private PipelineEntryRepository entryRepository;
    @Mock private LeadRepository leadRepository;

    @InjectMocks
    private PipelineService pipelineService;

    private Lead testLead;
    private PipelineStage testStage;
    private PipelineEntry testEntry;

    @BeforeEach
    void setUp() {
        testLead = new Lead();
        testLead.setId(UUID.randomUUID());
        testLead.setStatus(Lead.LeadStatus.NEW);

        testStage = new PipelineStage();
        testStage.setId(UUID.randomUUID());
        testStage.setName("WON");

        testEntry = new PipelineEntry();
        testEntry.setId(UUID.randomUUID());
        testEntry.setLead(testLead);
        testEntry.setStage(new PipelineStage()); // old stage
        testEntry.setPositionInStage(0);
    }

    @Test
    void updateLeadStage_ExistingEntry() {
        // Arrange
        when(leadRepository.findById(testLead.getId())).thenReturn(Optional.of(testLead));
        when(stageRepository.findById(testStage.getId())).thenReturn(Optional.of(testStage));
        when(entryRepository.findByDeletedAtIsNull()).thenReturn(List.of(testEntry));

        // Act
        pipelineService.updateLeadStage(testLead.getId(), testStage.getId(), 5);

        // Assert
        assertEquals(Lead.LeadStatus.WON, testLead.getStatus()); // Status mutated by "WON" stage
        assertEquals(testStage, testEntry.getStage());
        assertEquals(5, testEntry.getPositionInStage());
        
        verify(leadRepository).save(testLead);
        verify(entryRepository).save(testEntry);
    }

    @Test
    void updateLeadStage_NewEntry() {
        // Arrange
        when(leadRepository.findById(testLead.getId())).thenReturn(Optional.of(testLead));
        when(stageRepository.findById(testStage.getId())).thenReturn(Optional.of(testStage));
        when(entryRepository.findByDeletedAtIsNull()).thenReturn(List.of()); // No existing entry

        // Act
        pipelineService.updateLeadStage(testLead.getId(), testStage.getId(), 1);

        // Assert
        assertEquals(Lead.LeadStatus.WON, testLead.getStatus());
        verify(leadRepository).save(testLead);
        verify(entryRepository).save(argThat(entry -> 
            entry.getLead().equals(testLead) && 
            entry.getStage().equals(testStage) && 
            entry.getPositionInStage() == 1
        ));
    }

    @Test
    void updateLeadStage_LeadNotFound() {
        when(leadRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> 
            pipelineService.updateLeadStage(UUID.randomUUID(), testStage.getId(), 1)
        );
    }
}
