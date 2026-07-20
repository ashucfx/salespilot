package com.ripplenexus.salespilot.commission.presentation.dto;

import com.ripplenexus.salespilot.commission.domain.Payout;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class PayoutDto {
    private UUID id;
    private UUID employeeId;
    private String employeeName;
    private String employeeEmail;
    private BigDecimal amount;
    private BigDecimal baseSalary;
    private BigDecimal totalCommission;
    private String payoutPeriod;
    private LocalDate payoutDate;
    private String status;
    private String bankName;
    private String bankAccount;
    private String bankIfsc;
    private ZonedDateTime paidAt;
    private String paymentRef;
    private String notes;

    public static PayoutDto from(Payout p) {
        return PayoutDto.builder()
                .id(p.getId())
                .employeeId(p.getEmployee().getId())
                .employeeName(p.getEmployee().getFullName())
                .employeeEmail(p.getEmployee().getWorkEmail())
                .amount(p.getAmount())
                .baseSalary(p.getBaseSalary())
                .totalCommission(p.getTotalCommission())
                .payoutPeriod(p.getPayoutPeriod())
                .payoutDate(p.getPayoutDate())
                .status(p.getStatus().name())
                .bankName(p.getBankName())
                .bankAccount(p.getBankAccount())
                .bankIfsc(p.getBankIfsc())
                .paidAt(p.getPaidAt())
                .paymentRef(p.getPaymentRef())
                .notes(p.getNotes())
                .build();
    }
}
