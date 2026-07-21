package com.ripplenexus.salespilot.commission.application;

import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.commission.domain.CommissionRule;
import com.ripplenexus.salespilot.commission.domain.CommissionTier;
import com.ripplenexus.salespilot.commission.domain.EmployeeCommissionPlan;
import com.ripplenexus.salespilot.commission.infrastructure.CommissionPlanRepository;
import com.ripplenexus.salespilot.commission.infrastructure.CommissionRepository;
import com.ripplenexus.salespilot.commission.infrastructure.CommissionRuleRepository;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.deal.domain.Deal;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import com.ripplenexus.salespilot.commission.presentation.dto.EmployeePayoutSummaryDto;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.notification.application.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final CommissionRuleRepository commissionRuleRepository;
    private final CommissionPlanRepository commissionPlanRepository;
    private final EmployeeRepository employeeRepository;
    private final LeadRepository leadRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    /**
     * Automatically calculates and creates a commission when a deal is closed.
     * Called by DealService after deal closure.
     */
    public Commission calculateAndCreate(Deal deal, Employee employee) {
        if (commissionRepository.existsByDealId(deal.getId())) {
            log.warn("Commission already exists for deal {}", deal.getId());
            throw new BusinessException("Commission already generated for this deal.");
        }

        CommissionRule rule = getActiveRuleForEmployee(employee);

        BigDecimal commissionAmount = calculateAmount(rule, deal.getDealValue());

        Commission commission = Commission.builder()
                .deal(deal)
                .employee(employee)
                .rule(rule)
                .dealValue(deal.getDealValue())
                .commissionAmount(commissionAmount)
                .currency(deal.getCurrency())
                .status(Commission.CommissionStatus.PENDING)
                .build();

        commission = commissionRepository.save(commission);
        log.info("Commission created: {} for employee: {} | Amount: {}",
                commission.getId(), employee.getEmployeeNumber(), commissionAmount);

        return commission;
    }

    public void updateEmployeeCommissionRule(UUID employeeId, BigDecimal newPercentage) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", employeeId));

        String ruleName = "Custom " + newPercentage + "% Rule - " + employee.getEmployeeNumber();
        CommissionRule rule = commissionRuleRepository.findByName(ruleName)
                .orElseGet(() -> {
                    CommissionRule newRule = CommissionRule.builder()
                            .name(ruleName)
                            .type(CommissionRule.CommissionType.PERCENTAGE)
                            .percentage(newPercentage)
                            .isActive(true)
                            .build();
                    return commissionRuleRepository.save(newRule);
                });

        commissionPlanRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .forEach(plan -> {
                    plan.setActive(false);
                    plan.setEffectiveTo(LocalDate.now());
                    commissionPlanRepository.save(plan);
                });

        EmployeeCommissionPlan newPlan = EmployeeCommissionPlan.builder()
                .employee(employee)
                .rule(rule)
                .effectiveFrom(LocalDate.now())
                .isActive(true)
                .build();
        
        commissionPlanRepository.save(newPlan);
        log.info("Updated commission plan for {} to {}%", employee.getEmployeeNumber(), newPercentage);
    }

    public void approve(UUID commissionId, UUID approverEmployeeId, String notes) {
        Commission commission = getOrThrow(commissionId);
        if (commission.getStatus() != Commission.CommissionStatus.PENDING) {
            throw new BusinessException("Only PENDING commissions can be approved.");
        }

        Employee approver = employeeRepository.findById(approverEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", approverEmployeeId));

        commission.setStatus(Commission.CommissionStatus.APPROVED);
        commission.setApprovedBy(approver);
        commission.setApprovedAt(Instant.now());
        commission.setNotes(notes);
        commissionRepository.save(commission);

        // Notify employee
        String formattedAmount = formatAmount(commission.getCommissionAmount(), commission.getCurrency());
        notificationService.notifyCommissionApproved(
                commission.getEmployee().getUser(), formattedAmount);

        log.info("Commission approved: {} by {}", commissionId, approver.getEmployeeNumber());
    }

    public void reject(UUID commissionId, UUID approverEmployeeId, String reason) {
        Commission commission = getOrThrow(commissionId);
        if (commission.getStatus() != Commission.CommissionStatus.PENDING) {
            throw new BusinessException("Only PENDING commissions can be rejected.");
        }

        commission.setStatus(Commission.CommissionStatus.REJECTED);
        commission.setRejectionReason(reason);
        commissionRepository.save(commission);

        notificationService.notifyCommissionRejected(
                commission.getEmployee().getUser(), reason);

        log.info("Commission rejected: {} | Reason: {}", commissionId, reason);
    }

    public void markPaid(UUID commissionId, UUID paidByEmployeeId, String paymentRef) {
        Commission commission = getOrThrow(commissionId);
        if (commission.getStatus() != Commission.CommissionStatus.APPROVED) {
            throw new BusinessException("Only APPROVED commissions can be marked as paid.");
        }

        Employee paidBy = employeeRepository.findById(paidByEmployeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", paidByEmployeeId));

        commission.setStatus(Commission.CommissionStatus.PAID);
        commission.setPaidBy(paidBy);
        commission.setPaidAt(Instant.now());
        commission.setPaymentRef(paymentRef);
        commissionRepository.save(commission);

        String formattedAmount = formatAmount(commission.getCommissionAmount(), commission.getCurrency());
        notificationService.notifyCommissionPaid(
                commission.getEmployee().getUser(), formattedAmount);
        emailService.sendCommissionPaidEmail(
                commission.getEmployee().getWorkEmail(),
                commission.getEmployee().getFirstName(),
                formattedAmount);

        log.info("Commission marked paid: {} | Ref: {}", commissionId, paymentRef);
    }

    public PageResponse<Commission> getByEmployee(UUID employeeId, String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return PageResponse.of(commissionRepository
                    .findByEmployeeIdAndStatus(employeeId,
                            Commission.CommissionStatus.valueOf(status.toUpperCase()), pageable));
        }
        return PageResponse.of(commissionRepository.findByEmployeeId(employeeId, pageable));
    }

    public PageResponse<Commission> getAll(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return PageResponse.of(commissionRepository
                    .findByStatus(Commission.CommissionStatus.valueOf(status.toUpperCase()), pageable));
        }
        return PageResponse.of(commissionRepository.findAll(pageable));
    }

    public PageResponse<EmployeePayoutSummaryDto> getPayoutSummary(Pageable pageable) {
        return PageResponse.of(employeeRepository.findAllActive(pageable).map(emp -> {
            BigDecimal pending = commissionRepository.sumPendingByEmployee(emp.getId());
            long leadsGen = leadRepository.countByAssignedTo(emp.getId());
            long dealsClosed = leadRepository.countWonByEmployee(emp.getId());
            
            // Expected payout end of month
            LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
            
            return EmployeePayoutSummaryDto.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getFullName())
                    .employeeNumber(emp.getEmployeeNumber())
                    .totalPendingCommission(pending != null ? pending : BigDecimal.ZERO)
                    .leadsGenerated(leadsGen)
                    .dealsClosed(dealsClosed)
                    .nextPayoutDate(endOfMonth.toString())
                    .build();
        }));
    }

    // ─────────────────────────────────────────────────────────────
    // Commission calculation engine
    // ─────────────────────────────────────────────────────────────

    BigDecimal calculateAmount(CommissionRule rule, BigDecimal dealValue) {
        return switch (rule.getType()) {
            case PERCENTAGE -> dealValue
                    .multiply(rule.getPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            case FIXED -> rule.getFixedAmount();

            case HYBRID -> {
                BigDecimal pct = dealValue
                        .multiply(rule.getPercentage())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                yield pct.add(rule.getFixedAmount());
            }

            case TIERED -> calculateTieredAmount(rule.getTiers(), dealValue);
        };
    }

    private BigDecimal calculateTieredAmount(List<CommissionTier> tiers, BigDecimal dealValue) {
        for (CommissionTier tier : tiers) {
            boolean aboveMin = dealValue.compareTo(tier.getMinAmount()) >= 0;
            boolean belowMax = tier.getMaxAmount() == null
                    || dealValue.compareTo(tier.getMaxAmount()) <= 0;

            if (aboveMin && belowMax) {
                if (tier.getPercentage() != null) {
                    BigDecimal pct = dealValue
                            .multiply(tier.getPercentage())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                    BigDecimal fixed = tier.getFixedAmount() != null ? tier.getFixedAmount() : BigDecimal.ZERO;
                    return pct.add(fixed);
                }
                return tier.getFixedAmount() != null ? tier.getFixedAmount() : BigDecimal.ZERO;
            }
        }
        return BigDecimal.ZERO;
    }

    private CommissionRule getActiveRuleForEmployee(Employee employee) {
        return commissionPlanRepository
                .findActiveRuleByEmployee(employee.getId(), LocalDate.now())
                .orElseGet(() -> commissionRuleRepository.findFirstByIsActiveTrueOrderByCreatedAtAsc()
                        .orElseThrow(() -> new BusinessException("No active commission rule found.")));
    }

    private Commission getOrThrow(UUID id) {
        return commissionRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Commission", id));
    }

    private String formatAmount(BigDecimal amount, String currency) {
        return "INR".equals(currency) ? "₹" + amount : currency + " " + amount;
    }
}
