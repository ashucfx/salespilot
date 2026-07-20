package com.ripplenexus.salespilot.employee.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KycSubmissionRequest {

    @NotBlank(message = "Country is required")
    private String countryOfId;

    @NotBlank(message = "National ID number is required")
    private String nationalId;

    @NotBlank(message = "KYC Document is required")
    private String kycDocumentPath;

    @NotBlank(message = "UPI ID is required")
    private String upiId;

    @NotBlank(message = "Bank Name is required")
    private String bankName;

    @NotBlank(message = "Bank Account number is required")
    private String bankAccount;

    @NotBlank(message = "Bank IFSC code is required")
    private String bankIfsc;
}
