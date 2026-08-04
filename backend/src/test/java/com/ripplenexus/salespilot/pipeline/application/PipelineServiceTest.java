package com.ripplenexus.salespilot.pipeline.application;

import com.ripplenexus.salespilot.auth.domain.Role;
import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
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

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PipelineServiceTest {

    @Mock private PipelineStageRepository stageRepository;
    @Mock private PipelineEntryRepository entryRepository;
    @Mock private LeadRepository leadRepository;
    @Mock private EmployeeRepository employeeRepository;

    @InjectMocks
    private PipelineService pipelineService;

    private Lead testLead;
    private PipelineStage testStage;
    private PipelineEntry testEntry;
    private User adminUser;

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
        testEntry.setStage(new PipelineStage());
        testEntry.setPosition(0);

        // Admin user has ADMIN role so bypass ownership check
        Role adminRole = new Role();
        adminRole.setName("ADMIN");
        adminUser = new User();
        adminUser.setId(UUID.randomUUID());
        adminUser.setEmail("admin@salespilot.com");
        adminUser.setRoles(Set.of(adminRole));
    }

    @Test
    void updateLeadStage_ExistingEntry() {
        // Arrange
        when(leadRepository.findById(testLead.getId())).thenReturn(Optional.of(testLead));
        when(stageRepository.findById(testStage.getId())).thenReturn(Optional.of(testStage));
        // Return existing entry for this lead
        when(entryRepository.findByLeadId(testLead.getId())).thenReturn(Optional.of(testEntry));
        when(entryRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(leadRepository.save(testLead)).thenReturn(testLead);

        // Act — pass adminUser so ownership check is bypassed
        pipelineService.updateLeadStage(testLead.getId(), testStage.getId(), 5, adminUser);

        // Assert — stage was updated
        assertEquals(testStage, testEntry.getStage());
        verify(leadRepository).save(testLead);
        verify(entryRepository, atLeastOnce()).save(any(PipelineEntry.class));
    }

    @Test
    void updateLeadStage_NewEntry() {
        // Arrange
        when(leadRepository.findById(testLead.getId())).thenReturn(Optional.of(testLead));
        when(stageRepository.findById(testStage.getId())).thenReturn(Optional.of(testStage));
        // No existing entry — service creates a new PipelineEntry
        when(entryRepository.findByLeadId(testLead.getId())).thenReturn(Optional.empty());
        when(entryRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(leadRepository.save(testLead)).thenReturn(testLead);

        // Act
        pipelineService.updateLeadStage(testLead.getId(), testStage.getId(), 1, adminUser);

        // Assert
        verify(leadRepository).save(testLead);
        verify(entryRepository, atLeastOnce()).save(any(PipelineEntry.class));
    }

    @Test
    void updateLeadStage_LeadNotFound() {
        when(leadRepository.findById(any())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () ->
            pipelineService.updateLeadStage(UUID.randomUUID(), testStage.getId(), 1, adminUser)
        );
    }
}
