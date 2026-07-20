package com.ripplenexus.salespilot.integration.clientforge.presentation;

import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.integration.clientforge.application.ClientForgeService;
import com.ripplenexus.salespilot.integration.clientforge.presentation.dto.InvoicePaidWebhookRequest;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/client-forge")
@RequiredArgsConstructor
public class ClientForgeController {

    private final ClientForgeService clientForgeService;

    @Operation(summary = "Push a won deal to Client Forge to generate an invoice")
    @PostMapping("/push-deal/{dealId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> pushDealToClientForge(@PathVariable UUID dealId) {
        clientForgeService.pushDealToClientForge(dealId);
        return ResponseEntity.ok(ApiResponse.success("Deal pushed to Client Forge successfully", null));
    }

    @Operation(summary = "Webhook triggered by Client Forge when an invoice is paid")
    @PostMapping("/webhooks/invoice-paid")
    // Note: In a real scenario, this would have signature validation or an API key, not a user role.
    // For now, we will allow anonymous access or use a specific api key filter.
    public ResponseEntity<ApiResponse<Void>> handleInvoicePaidWebhook(@RequestBody InvoicePaidWebhookRequest request) {
        clientForgeService.handleInvoicePaid(request);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", null));
    }
}
