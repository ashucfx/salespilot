package com.ripplenexus.salespilot.integration.clientforge.presentation.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class InvoicePaidWebhookRequest {
    private String invoiceId;
    private UUID dealId;
    private BigDecimal amountPaid;
    private String clientEmail;
}
