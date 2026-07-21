package com.ripplenexus.salespilot.lead.application;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.lead.domain.LeadSource;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import com.ripplenexus.salespilot.lead.infrastructure.LeadSourceRepository;
import com.ripplenexus.salespilot.lead.presentation.dto.CreateLeadRequest;
import com.ripplenexus.salespilot.lead.presentation.dto.LeadDto;
import com.ripplenexus.salespilot.lead.presentation.dto.UpdateLeadRequest;
import com.ripplenexus.salespilot.notification.application.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LeadService {

    private final LeadRepository leadRepository;
    private final LeadSourceRepository leadSourceRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public LeadDto createLead(CreateLeadRequest request, User currentUser) {
        Employee assignedTo = null;
        if (request.getAssignedToId() != null) {
            assignedTo = employeeRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", request.getAssignedToId()));
        } else {
            // Auto-assign to creator if they are an employee
            assignedTo = employeeRepository.findByUserId(currentUser.getId()).orElse(null);
        }

        LeadSource source = null;
        if (request.getSourceId() != null) {
            source = leadSourceRepository.findById(request.getSourceId()).orElse(null);
        }

        Lead lead = Lead.builder()
                .leadNumber(generateLeadNumber())
                .contactName(request.getContactName())
                .contactDesignation(request.getContactDesignation())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .contactWhatsapp(request.getContactWhatsapp())
                .contactLinkedin(request.getContactLinkedin())
                .companyName(request.getCompanyName())
                .companyWebsite(request.getCompanyWebsite())
                .industry(request.getIndustry())
                .country(request.getCountry())
                .budget(request.getBudget())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .interestedServices(request.getInterestedServices())
                .priority(request.getPriority() != null ? request.getPriority() : Lead.LeadPriority.MEDIUM)
                .source(source)
                .assignedTo(assignedTo)
                .status(Lead.LeadStatus.NEW)
                .expectedCloseDate(request.getExpectedCloseDate())
                .probability(request.getProbability())
                .notes(request.getNotes())
                .build();

        lead = leadRepository.save(lead);

        // Notify assigned employee
        if (assignedTo != null && !assignedTo.getUser().getId().equals(currentUser.getId())) {
            notificationService.notifyLeadAssigned(assignedTo.getUser(), lead);
            emailService.sendLeadAssignedEmail(
                    assignedTo.getWorkEmail(),
                    assignedTo.getFirstName(),
                    lead.getContactName(),
                    lead.getCompanyName()
            );
        }

        log.info("Lead created: {} by {}", lead.getLeadNumber(), currentUser.getEmail());
        return LeadDto.from(lead);
    }

    public LeadDto updateLead(UUID id, UpdateLeadRequest request, User currentUser) {
        Lead lead = getLeadOrThrow(id);
        enforceDataAccess(lead, currentUser);

        if (request.getContactName() != null) lead.setContactName(request.getContactName());
        if (request.getContactEmail() != null) lead.setContactEmail(request.getContactEmail());
        if (request.getContactPhone() != null) lead.setContactPhone(request.getContactPhone());
        if (request.getContactWhatsapp() != null) lead.setContactWhatsapp(request.getContactWhatsapp());
        if (request.getCompanyName() != null) lead.setCompanyName(request.getCompanyName());
        if (request.getIndustry() != null) lead.setIndustry(request.getIndustry());
        if (request.getCountry() != null) lead.setCountry(request.getCountry());
        if (request.getBudget() != null) lead.setBudget(request.getBudget());
        if (request.getPriority() != null) lead.setPriority(request.getPriority());
        if (request.getExpectedCloseDate() != null) lead.setExpectedCloseDate(request.getExpectedCloseDate());
        if (request.getProbability() != null) lead.setProbability(request.getProbability());
        if (request.getNotes() != null) lead.setNotes(request.getNotes());

        // Status transition
        if (request.getStatus() != null && !request.getStatus().equals(lead.getStatus())) {
            lead.setStatus(request.getStatus());
        }

        // Reassignment (Admin/Manager only — enforced at controller)
        if (request.getAssignedToId() != null && (lead.getAssignedTo() == null || !lead.getAssignedTo().getId().equals(request.getAssignedToId()))) {
            Employee newAssignee = employeeRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", request.getAssignedToId()));
            lead.setAssignedTo(newAssignee);
            
            if (!newAssignee.getUser().getId().equals(currentUser.getId())) {
                emailService.sendLeadAssignedEmail(
                        newAssignee.getWorkEmail(),
                        newAssignee.getFirstName(),
                        lead.getContactName(),
                        lead.getCompanyName()
                );
            }
        }

        return LeadDto.from(leadRepository.save(lead));
    }

    public void deleteLead(UUID id, User currentUser) {
        Lead lead = getLeadOrThrow(id);
        if (!currentUser.hasRole("ADMIN")) {
            throw new BusinessException("Only admins can delete leads.");
        }
        lead.softDelete();
        leadRepository.save(lead);
    }

    public LeadDto getById(UUID id, User currentUser) {
        Lead lead = getLeadOrThrow(id);
        enforceDataAccess(lead, currentUser);
        return LeadDto.from(lead);
    }

    public PageResponse<LeadDto> getAll(String search, String status, String priority,
                                         UUID assignedTo, User currentUser, Pageable pageable) {
        Page<Lead> page;

        if (currentUser.hasRole("ADMIN") || currentUser.hasRole("SALES_MANAGER")) {
            page = leadRepository.findAll(search, status, priority, assignedTo, pageable);
        } else {
            // Employee: only see own assigned leads
            Employee emp = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
            page = leadRepository.findByAssignedToId(emp.getId(), search, status, priority, pageable);
        }

        return PageResponse.of(page.map(LeadDto::from));
    }

    // ─────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────

    private Lead getLeadOrThrow(UUID id) {
        return leadRepository.findById(id)
                .filter(l -> l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
    }

    private void enforceDataAccess(Lead lead, User currentUser) {
        if (currentUser.hasRole("ADMIN") || currentUser.hasRole("SALES_MANAGER")) return;
        Employee emp = employeeRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        if (lead.getAssignedTo() == null || !lead.getAssignedTo().getId().equals(emp.getId())) {
            throw new BusinessException("Access denied. You can only access your own assigned leads.");
        }
    }

    private String generateLeadNumber() {
        YearMonth now = YearMonth.now();
        String prefix = String.format("LD-%04d%02d", now.getYear(), now.getMonthValue());
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return String.format("%s-%s", prefix, randomSuffix);
    }
}
