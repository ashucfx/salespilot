package com.ripplenexus.salespilot.commission.application;

import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.commission.domain.CommissionRule;
import com.ripplenexus.salespilot.commission.infrastructure.CommissionRepository;
import com.ripplenexus.salespilot.commission.infrastructure.CommissionRuleRepository;
import com.ripplenexus.salespilot.deal.domain.Deal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommissionServiceTest {

    @Mock private CommissionRepository commissionRepository;
    @Mock private CommissionRuleRepository ruleRepository;

    @InjectMocks
    private CommissionService commissionService;

    private Deal testDeal;

    @BeforeEach
    void setUp() {
        testDeal = new Deal();
        testDeal.setId(UUID.randomUUID());
        testDeal.setDealValue(new BigDecimal("100000.00")); // $100k deal
        // assuming deal has an owner (employee) and we generate commission for them
    }

    @Test
    void calculateCommission_PercentageRule() {
        // Arrange
        CommissionRule rule = new CommissionRule();
        rule.setRuleType(CommissionRule.RuleType.PERCENTAGE);
        rule.setPercentage(new BigDecimal("10.00")); // 10%
        rule.setIsActive(true);

        when(ruleRepository.findActiveRuleForDeal(any())).thenReturn(Optional.of(rule));
        when(commissionRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Commission commission = commissionService.calculateAndGenerateCommission(testDeal);

        // Assert
        assertNotNull(commission);
        // 10% of 100k = 10,000
        assertEquals(0, new BigDecimal("10000.00").compareTo(commission.getAmount()));
        assertEquals(Commission.CommissionStatus.PENDING, commission.getStatus());
        verify(commissionRepository).save(any(Commission.class));
    }

    @Test
    void calculateCommission_FixedRule() {
        // Arrange
        CommissionRule rule = new CommissionRule();
        rule.setRuleType(CommissionRule.RuleType.FIXED);
        rule.setFixedAmount(new BigDecimal("5000.00"));
        rule.setIsActive(true);

        when(ruleRepository.findActiveRuleForDeal(any())).thenReturn(Optional.of(rule));
        when(commissionRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Commission commission = commissionService.calculateAndGenerateCommission(testDeal);

        // Assert
        assertNotNull(commission);
        assertEquals(0, new BigDecimal("5000.00").compareTo(commission.getAmount()));
        verify(commissionRepository).save(any(Commission.class));
    }

    @Test
    void calculateCommission_HybridRule() {
        // Arrange
        CommissionRule rule = new CommissionRule();
        rule.setRuleType(CommissionRule.RuleType.HYBRID);
        rule.setFixedAmount(new BigDecimal("2000.00"));
        rule.setPercentage(new BigDecimal("5.00")); // 5%
        rule.setIsActive(true);

        when(ruleRepository.findActiveRuleForDeal(any())).thenReturn(Optional.of(rule));
        when(commissionRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // Act
        Commission commission = commissionService.calculateAndGenerateCommission(testDeal);

        // Assert
        // 5% of 100k = 5,000 + 2,000 fixed = 7,000
        assertNotNull(commission);
        assertEquals(0, new BigDecimal("7000.00").compareTo(commission.getAmount()));
    }
}
