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
    public ResponseEntity<ApiResponse<Void>> handleInvoicePaidWebhook(
            @RequestHeader(value = "X-Client-Forge-Signature", required = false) String signature,
            @RequestBody InvoicePaidWebhookRequest request) {
            
        // In a real prod environment, this should be in application.yml
        String EXPECTED_SECRET = "cf_prod_secret_8f9a2b"; 
        
        if (signature == null || !signature.equals(EXPECTED_SECRET)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid webhook signature"));
        }
        
        clientForgeService.handleInvoicePaid(request);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed successfully", null));
    }
}
