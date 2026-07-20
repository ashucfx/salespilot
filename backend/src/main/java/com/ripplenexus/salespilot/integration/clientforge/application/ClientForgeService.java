package com.ripplenexus.salespilot.integration.clientforge.application;

import com.ripplenexus.salespilot.commission.application.CommissionService;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.deal.domain.Deal;
import com.ripplenexus.salespilot.deal.infrastructure.DealRepository;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.integration.clientforge.presentation.dto.InvoicePaidWebhookRequest;
import com.ripplenexus.salespilot.lead.domain.Lead;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClientForgeService {

    private final DealRepository dealRepository;
    private final EmployeeRepository employeeRepository;
    private final CommissionService commissionService;

    public void pushDealToClientForge(UUID dealId) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", dealId));

        // In a real application, we would make an HTTP POST to Client Forge's API here.
        String clientEmail = deal.getLead() != null ? deal.getLead().getContactEmail() : "unknown@client.com";
        String clientPhone = deal.getLead() != null ? deal.getLead().getContactPhone() : "0000000000";
        log.info("Mock: Pushing deal {} to Client Forge API... Client Email: {}, Phone: {}", deal.getId(), clientEmail, clientPhone);
    }

    public void handleInvoicePaid(InvoicePaidWebhookRequest request) {
        log.info("Received Client Forge webhook for invoice paid: {}", request.getInvoiceId());

        Deal deal = dealRepository.findById(request.getDealId())
                .orElseThrow(() -> new ResourceNotFoundException("Deal", request.getDealId()));

        Lead lead = deal.getLead();
        if (lead.getAssignedTo() == null) {
            log.warn("Deal {} has no assigned sales employee to receive commission.", deal.getId());
            return;
        }

        Employee salesEmployee = lead.getAssignedTo();

        // Trigger the commission engine!
        commissionService.calculateAndCreate(deal, salesEmployee);
        
        log.info("Commission created for Employee {} due to invoice payment of Deal {}", salesEmployee.getEmployeeNumber(), deal.getId());
    }
}
