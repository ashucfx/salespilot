package com.ripplenexus.salespilot.deal.presentation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CloseDealRequest {

    @NotNull(message = "Deal value is required")
    @DecimalMin(value = "0.01", message = "Deal value must be positive")
    private BigDecimal dealValue;

    private String currency = "INR";
    private String invoiceNumber;
    private boolean paymentReceived = false;
    private String paymentMethod;
    private String notes;
}
