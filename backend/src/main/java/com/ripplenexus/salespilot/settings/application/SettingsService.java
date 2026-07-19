package com.ripplenexus.salespilot.settings.application;

import com.ripplenexus.salespilot.settings.domain.SystemSetting;
import com.ripplenexus.salespilot.settings.infrastructure.SystemSettingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SettingsService {

    private final SystemSettingRepository settingsRepository;

    public List<SystemSetting> getAllSettings() {
        return settingsRepository.findAll();
    }

    public List<SystemSetting> getPublicSettings() {
        return settingsRepository.findByIsPublicTrue();
    }

    public SystemSetting updateSetting(String key, String value) {
        SystemSetting setting = settingsRepository.findByKey(key)
                .orElseGet(() -> SystemSetting.builder()
                        .key(key)
                        .category("CUSTOM")
                        .build());
        
        setting.setValue(value);
        return settingsRepository.save(setting);
    }

    public void updateMultipleSettings(Map<String, String> updates) {
        updates.forEach(this::updateSetting);
    }
}
