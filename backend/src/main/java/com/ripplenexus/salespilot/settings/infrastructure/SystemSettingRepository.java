package com.ripplenexus.salespilot.settings.infrastructure;

import com.ripplenexus.salespilot.settings.domain.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, UUID> {
    Optional<SystemSetting> findByKey(String key);
    List<SystemSetting> findByCategory(String category);
    List<SystemSetting> findByIsPublicTrue();
}
