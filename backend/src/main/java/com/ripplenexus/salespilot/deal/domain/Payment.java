package com.ripplenexus.salespilot.deal.domain;

import com.ripplenexus.salespilot.core.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id", nullable = false)
    private Deal deal;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "payment_date", nullable = false)
    private java.time.LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "transaction_ref")
    private String transactionRef;

    @Column(name = "is_received", nullable = false)
    @Builder.Default
    private Boolean isReceived = true;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    public enum PaymentMethod {
        BANK_TRANSFER, CREDIT_CARD, CASH, CHEQUE, ONLINE_GATEWAY
    }
}
