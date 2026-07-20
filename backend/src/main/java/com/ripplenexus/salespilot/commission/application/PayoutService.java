package com.ripplenexus.salespilot.commission.application;

import com.ripplenexus.salespilot.commission.domain.Commission;
import com.ripplenexus.salespilot.commission.domain.Payout;
import com.ripplenexus.salespilot.commission.infrastructure.PayoutRepository;
import com.ripplenexus.salespilot.commission.presentation.dto.PayoutDto;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PayoutService {

    private final PayoutRepository payoutRepository;
    private final EmployeeRepository employeeRepository;

    public PageResponse<PayoutDto> getAllPayouts(Pageable pageable) {
        Page<Payout> page = payoutRepository.findAll(pageable);
        return PageResponse.of(page.map(PayoutDto::from));
    }

    public PageResponse<PayoutDto> getMyPayouts(UUID userId, Pageable pageable) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        Page<Payout> page = payoutRepository.findByEmployeeId(employee.getId(), pageable);
        return PageResponse.of(page.map(PayoutDto::from));
    }

    public PayoutDto markAsPaid(UUID payoutId, String paymentRef) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Payout", payoutId));
        
        payout.setStatus(Commission.CommissionStatus.PAID);
        payout.setPaidAt(java.time.ZonedDateTime.now());
        payout.setPaymentRef(paymentRef);
        
        return PayoutDto.from(payoutRepository.save(payout));
    }
}
