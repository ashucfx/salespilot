package com.ripplenexus.salespilot.incentive.application;

import com.ripplenexus.salespilot.core.email.EmailService;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.deal.infrastructure.DealRepository;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.incentive.domain.EmployeeIncentive;
import com.ripplenexus.salespilot.incentive.domain.Incentive;
import com.ripplenexus.salespilot.incentive.infrastructure.EmployeeIncentiveRepository;
import com.ripplenexus.salespilot.incentive.infrastructure.IncentiveRepository;
import com.ripplenexus.salespilot.incentive.presentation.dto.EmployeeIncentiveDto;
import com.ripplenexus.salespilot.incentive.presentation.dto.IncentiveDto;
import com.ripplenexus.salespilot.incentive.presentation.dto.LeaderboardDto;
import com.ripplenexus.salespilot.lead.infrastructure.LeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class IncentiveService {

    private final IncentiveRepository incentiveRepository;
    private final EmployeeIncentiveRepository employeeIncentiveRepository;
    private final EmployeeRepository employeeRepository;
    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;
    private final EmailService emailService;

    public List<IncentiveDto> getAllActiveIncentives() {
        return incentiveRepository.findByStatusAndDeletedAtIsNull(Incentive.Status.ACTIVE)
                .stream()
                .map(IncentiveDto::from)
                .toList();
    }

    public List<EmployeeIncentiveDto> getEmployeeIncentives(UUID userId) {
        Employee employee = getEmployeeByUserId(userId);
        evaluateIncentivesForEmployee(employee);

        return employeeIncentiveRepository.findByEmployeeIdAndDeletedAtIsNull(employee.getId())
                .stream()
                .map(EmployeeIncentiveDto::from)
                .toList();
    }

    public EmployeeIncentiveDto claimIncentive(UUID userId, UUID incentiveId) {
        Employee employee = getEmployeeByUserId(userId);
        evaluateIncentivesForEmployee(employee);

        EmployeeIncentive ei = employeeIncentiveRepository.findByEmployeeIdAndIncentiveIdAndDeletedAtIsNull(employee.getId(), incentiveId)
                .orElseThrow(() -> new ResourceNotFoundException("Incentive progress not found for employee"));

        if (ei.getStatus() == EmployeeIncentive.ClaimStatus.CLAIMED) {
            throw new BusinessException("Incentive reward has already been claimed.");
        }

        if (ei.getCurrentProgress().compareTo(ei.getIncentive().getTargetValue()) < 0) {
            throw new BusinessException("Target milestone has not been reached yet.");
        }

        ei.setStatus(EmployeeIncentive.ClaimStatus.CLAIMED);
        ei.setClaimedAt(Instant.now());
        employeeIncentiveRepository.save(ei);

        log.info("Incentive claimed: {} by employee {}", ei.getIncentive().getTitle(), employee.getEmployeeNumber());

        // Send email alert to employee
        try {
            emailService.sendNotificationEmail(
                    employee.getWorkEmail(),
                    "🏆 Incentive Reward Claimed!",
                    "Congratulations " + employee.getFirstName() + "! You have claimed your reward of ₹" 
                            + ei.getIncentive().getRewardAmount() + " for completing the '" 
                            + ei.getIncentive().getTitle() + "' challenge!"
            );
        } catch (Exception e) {
            log.warn("Could not send incentive email alert", e);
        }

        return EmployeeIncentiveDto.from(ei);
    }

    public List<LeaderboardDto> getLeaderboard() {
        List<Employee> employees = employeeRepository.findAllActive(org.springframework.data.domain.Pageable.unpaged()).getContent();
        List<LeaderboardDto> leaderboard = new ArrayList<>();

        for (Employee emp : employees) {
            BigDecimal totalRev = dealRepository.sumRevenueByEmployee(emp.getId());
            if (totalRev == null) totalRev = BigDecimal.ZERO;

            long dealsClosed = leadRepository.countWonByEmployee(emp.getId());

            // Calculate claimed rewards
            List<EmployeeIncentive> empIncentives = employeeIncentiveRepository.findByEmployeeIdAndDeletedAtIsNull(emp.getId());
            BigDecimal claimedRewards = empIncentives.stream()
                    .filter(ei -> ei.getStatus() == EmployeeIncentive.ClaimStatus.CLAIMED)
                    .map(ei -> ei.getIncentive().getRewardAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String tier = calculateTier(totalRev);

            leaderboard.add(LeaderboardDto.builder()
                    .employeeId(emp.getId())
                    .employeeName(emp.getFullName())
                    .employeeNumber(emp.getEmployeeNumber())
                    .avatarUrl(emp.getProfilePicture())
                    .designation(emp.getDesignation() != null ? emp.getDesignation() : "Sales Executive")
                    .totalRevenue(totalRev)
                    .dealsClosed(dealsClosed)
                    .totalIncentivesEarned(claimedRewards)
                    .salesTier(tier)
                    .badgeIcon(getTierIcon(tier))
                    .build());
        }

        // Sort by total revenue descending
        leaderboard.sort((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()));

        // Assign ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    public void evaluateIncentivesForEmployee(Employee employee) {
        List<Incentive> activeIncentives = incentiveRepository.findByStatusAndDeletedAtIsNull(Incentive.Status.ACTIVE);

        BigDecimal totalRevenue = dealRepository.sumRevenueByEmployee(employee.getId());
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        long dealsWon = leadRepository.countWonByEmployee(employee.getId());
        long leadsConverted = leadRepository.countWonByEmployee(employee.getId());

        for (Incentive inc : activeIncentives) {
            EmployeeIncentive ei = employeeIncentiveRepository
                    .findByEmployeeIdAndIncentiveIdAndDeletedAtIsNull(employee.getId(), inc.getId())
                    .orElseGet(() -> EmployeeIncentive.builder()
                            .employee(employee)
                            .incentive(inc)
                            .currentProgress(BigDecimal.ZERO)
                            .status(EmployeeIncentive.ClaimStatus.IN_PROGRESS)
                            .build());

            BigDecimal progress = BigDecimal.ZERO;
            switch (inc.getTargetType()) {
                case DEAL_REVENUE -> progress = totalRevenue;
                case DEALS_CLOSED -> progress = BigDecimal.valueOf(dealsWon);
                case LEADS_CONVERTED -> progress = BigDecimal.valueOf(leadsConverted);
            }

            ei.setCurrentProgress(progress);

            if (ei.getStatus() == EmployeeIncentive.ClaimStatus.IN_PROGRESS 
                    && progress.compareTo(inc.getTargetValue()) >= 0) {
                ei.setStatus(EmployeeIncentive.ClaimStatus.CLAIMABLE);
            }

            employeeIncentiveRepository.save(ei);
        }
    }

    private String calculateTier(BigDecimal revenue) {
        if (revenue.compareTo(BigDecimal.valueOf(1000000)) >= 0) return "Diamond Champion";
        if (revenue.compareTo(BigDecimal.valueOf(500000)) >= 0) return "Platinum Exec";
        if (revenue.compareTo(BigDecimal.valueOf(250000)) >= 0) return "Gold Performer";
        if (revenue.compareTo(BigDecimal.valueOf(100000)) >= 0) return "Silver Agent";
        return "Bronze Rising Star";
    }

    private String getTierIcon(String tier) {
        if (tier.contains("Diamond")) return "gem";
        if (tier.contains("Platinum")) return "crown";
        if (tier.contains("Gold")) return "trophy";
        if (tier.contains("Silver")) return "award";
        return "shield";
    }

    private Employee getEmployeeByUserId(UUID userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user " + userId));
    }
}
