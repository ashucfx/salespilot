package com.ripplenexus.salespilot.deal.application;

import com.ripplenexus.salespilot.commission.application.CommissionService;
import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.deal.domain.Deal;
import com.ripplenexus.salespilot.deal.infrastructure.DealRepository;
import com.ripplenexus.salespilot.deal.presentation.dto.CloseDealRequest;
import com.ripplenexus.salespilot.deal.presentation.dto.DealDto;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import com.ripplenexus.salespilot.notification.application.NotificationService;
import com.ripplenexus.salespilot.target.application.TargetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DealService {

    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;
    private final EmployeeRepository employeeRepository;
    private final CommissionService commissionService;
    private final TargetService targetService;
    private final NotificationService notificationService;
    private final com.ripplenexus.salespilot.core.email.EmailService emailService;

    /**
     * Closes a deal when a lead is marked WON.
     * Auto-calculates commission, updates target progress.
     */
    public DealDto closeDeal(UUID leadId, CloseDealRequest request, UUID closedByUserId) {
        Lead lead = leadRepository.findById(leadId)
                .filter(l -> l.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", leadId));

        if (lead.getStatus() == Lead.LeadStatus.WON) {
            throw new BusinessException("This lead is already closed as WON.");
        }

        Employee employee = employeeRepository.findByUserId(closedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        // Mark lead as WON
        lead.setStatus(Lead.LeadStatus.WON);
        lead.setDealValue(request.getDealValue());
        leadRepository.save(lead);

        // Create deal record
        Deal deal = Deal.builder()
                .lead(lead)
                .dealNumber(generateDealNumber())
                .employee(employee)
                .dealValue(request.getDealValue())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .invoiceNumber(request.getInvoiceNumber())
                .notes(request.getNotes())
                .build();
        deal = dealRepository.save(deal);

        // Calculate commission
        Commission commission = commissionService.calculateAndCreate(deal, employee);
        log.info("Commission created: {} for deal: {}", commission.getId(), deal.getDealNumber());

        // Update target progress
        targetService.updateRevenueProgress(employee.getId(), request.getDealValue());

        // Gamification: Check if this is the employee's first closed deal
        long count = dealRepository.countByEmployee(employee.getId());
        if (count == 1) {
            emailService.sendFirstDealClosedEmail(
                    employee.getWorkEmail(),
                    employee.getFirstName(),
                    deal.getDealNumber()
            );
        }

        log.info("Deal closed: {} | Value: {} | Employee: {}",
                deal.getDealNumber(), request.getDealValue(), employee.getEmployeeNumber());

        return DealDto.from(deal);
    }

    public PageResponse<DealDto> getByEmployee(UUID employeeId, Pageable pageable) {
        return PageResponse.of(dealRepository
                .findByEmployeeIdAndDeletedAtIsNull(employeeId, pageable)
                .map(DealDto::from));
    }

    private String generateDealNumber() {
        YearMonth now = YearMonth.now();
        long count = dealRepository.count() + 1;
        return String.format("DEAL-%04d%02d-%04d", now.getYear(), now.getMonthValue(), count);
    }
}
