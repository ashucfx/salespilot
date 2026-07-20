package com.ripplenexus.salespilot.core.email;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to expose job execution to external cron schedulers (like Vercel Cron).
 * This is crucial for free-tier deployments where the backend may sleep and miss Spring's internal @Scheduled triggers.
 */
@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class EmailJobController {

    private final EmailNotificationScheduler scheduler;

    @PostMapping("/daily-agenda")
    public ResponseEntity<String> triggerDailyAgenda() {
        scheduler.executeDailyAgenda();
        return ResponseEntity.ok("Daily agenda email blast triggered successfully.");
    }

    @PostMapping("/weekly-summary")
    public ResponseEntity<String> triggerWeeklySummary() {
        scheduler.executeWeeklySummary();
        return ResponseEntity.ok("Weekly performance summary blast triggered successfully.");
    }
}
