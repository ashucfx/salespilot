package com.ripplenexus.salespilot.core.email;

import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.employee.infrastructure.EmployeeRepository;
import com.ripplenexus.salespilot.deal.infrastructure.DealRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailNotificationScheduler {

    private final EmployeeRepository employeeRepository;
    private final DealRepository dealRepository;
    private final EmailService emailService;

    /**
     * Executes the daily agenda email blast.
     * Can be triggered internally by Spring Scheduler or externally via Vercel Cron.
     */
    public void executeDailyAgenda() {
        log.info("Starting Daily Agenda email blast...");
        
        List<Employee> activeEmployees = employeeRepository.findAll();
        
        int emailsSent = 0;
        final int DAILY_LIMIT = 290; // Leave 10 for other transacational emails

        for (Employee employee : activeEmployees) {
            if (emailsSent >= DAILY_LIMIT) {
                log.warn("Daily email limit reached ({}). Stopping agenda blast.", DAILY_LIMIT);
                break;
            }

            if (employee.getStatus() == Employee.EmploymentStatus.ACTIVE) {
                try {
                    // For a real production app, we would query the follow-up and meeting repositories here.
                    int pendingFollowUps = 3; 
                    int todayMeetings = 2;    
                    
                    emailService.sendDailyAgendaEmail(
                            employee.getWorkEmail(),
                            employee.getFirstName(),
                            pendingFollowUps,
                            todayMeetings
                    );
                    emailsSent++;
                    
                    // Throttle to respect Brevo API rate limits
                    Thread.sleep(150); 
                } catch (Exception e) {
                    log.error("Failed to send agenda to {}: {}", employee.getWorkEmail(), e.getMessage());
                    // Continue to next employee
                }
            }
        }
        log.info("Daily Agenda email blast completed.");
    }

    /**
     * Executes the weekly performance summary email blast.
     */
    public void executeWeeklySummary() {
        log.info("Starting Weekly Performance Summary email blast...");
        
        List<Employee> activeEmployees = employeeRepository.findAll();
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        
        int emailsSent = 0;
        final int WEEKLY_LIMIT = 290;

        for (Employee employee : activeEmployees) {
            if (emailsSent >= WEEKLY_LIMIT) {
                log.warn("Weekly email limit reached ({}). Stopping summary blast.", WEEKLY_LIMIT);
                break;
            }

            if (employee.getStatus() == Employee.EmploymentStatus.ACTIVE) {
                try {
                    long dealsCount = dealRepository.countByEmployee(employee.getId());
                    BigDecimal revenue = dealRepository.sumRevenueByEmployee(employee.getId());
                    
                    if (revenue == null) revenue = BigDecimal.ZERO;

                    emailService.sendWeeklyPerformanceSummaryEmail(
                            employee.getWorkEmail(),
                            employee.getFirstName(),
                            (int) dealsCount,
                            revenue.toString()
                    );
                    emailsSent++;
                    
                    Thread.sleep(150);
                } catch (Exception e) {
                    log.error("Failed to send weekly summary to {}: {}", employee.getWorkEmail(), e.getMessage());
                }
            }
        }
        log.info("Weekly Performance Summary email blast completed.");
    }

    /**
     * Internal Spring Cron: Runs every weekday (MON-FRI) at 8:00 AM server time.
     * Disable this in application.yml if you strictly rely on Vercel Cron.
     */
    @Scheduled(cron = "${salespilot.jobs.daily-agenda.cron:0 0 8 * * MON-FRI}")
    public void scheduledDailyAgenda() {
        executeDailyAgenda();
    }

    /**
     * Internal Spring Cron: Runs every Friday at 5:00 PM server time.
     */
    @Scheduled(cron = "${salespilot.jobs.weekly-summary.cron:0 0 17 * * FRI}")
    public void scheduledWeeklySummary() {
        executeWeeklySummary();
    }
}
