package com.ripplenexus.salespilot.settings.presentation;

import com.ripplenexus.salespilot.core.dto.ResponseDto;
import com.ripplenexus.salespilot.settings.application.SettingsService;
import com.ripplenexus.salespilot.settings.domain.SystemSetting;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<List<SystemSetting>>> getAllSettings() {
        return ResponseEntity.ok(ResponseDto.success(settingsService.getAllSettings()));
    }

    @GetMapping("/public")
    public ResponseEntity<ResponseDto<List<SystemSetting>>> getPublicSettings() {
        return ResponseEntity.ok(ResponseDto.success(settingsService.getPublicSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponseDto<Void>> updateSettings(@RequestBody Map<String, String> updates) {
        settingsService.updateMultipleSettings(updates);
        return ResponseEntity.ok(ResponseDto.success(null));
    }
}
