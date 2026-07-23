package com.ripplenexus.salespilot.settings.presentation;

import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.settings.application.SettingsService;
import com.ripplenexus.salespilot.settings.domain.SystemSetting;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getAllSettings()));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getPublicSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody Map<String, String> updates) {
        settingsService.updateMultipleSettings(updates);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
