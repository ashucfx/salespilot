package com.ripplenexus.salespilot.core.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${salespilot.email.from:ashutosh.shukla@theripplenexus.com}")
    private String from;

    @Value("${salespilot.email.from-name:Sales Pilot}")
    private String fromName;

    @Value("${spring.mail.password}")
    private String apiKey; // The xkeysib- API key from application.yml

    @Value("${salespilot.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    @Async
    public void sendWelcomeEmail(String to, String name, String tempPassword) {
        String subject = "Welcome to Sales Pilot! \uD83D\uDE80";
        String html = EmailTemplates.welcome(name, to, tempPassword, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendOtpEmail(String to, String otpCode) {
        String subject = "Your SalesPilot Security Code";
        String html = EmailTemplates.otpCode(otpCode);
        
        log.info("=========================================");
        log.info("OTP EMAIL INITIATED TO: {}", to);
        log.info("OTP CODE: {}", otpCode);
        log.info("=========================================");
        
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Reset Your Sales Pilot Password";
        String html = EmailTemplates.passwordReset(resetLink);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendLeadAssignedEmail(String to, String employeeName, String leadName, String company) {
        String subject = "New Lead Assigned: " + leadName;
        String html = EmailTemplates.leadAssigned(employeeName, leadName, company, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendMeetingReminderEmail(String to, String employeeName, String meetingTitle, String scheduledAt) {
        String subject = "Meeting Scheduled: " + meetingTitle;
        String html = EmailTemplates.meetingReminder(employeeName, meetingTitle, scheduledAt, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendDailyAgendaEmail(String to, String employeeName, int followUpsCount, int meetingsCount) {
        String subject = "Your Daily Agenda \u26F1\uFE0F";
        String html = EmailTemplates.dailyAgenda(employeeName, followUpsCount, meetingsCount, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendKycStatusUpdateEmail(String to, String employeeName, String status) {
        String subject = "KYC Status Update";
        String html = EmailTemplates.kycStatusUpdate(employeeName, status, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendFirstDealClosedEmail(String to, String employeeName, String dealName) {
        String subject = "\uD83C\uDF89 Congratulations on your FIRST deal!";
        String html = EmailTemplates.firstDealClosed(employeeName, dealName, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendTargetAchievedEmail(String to, String employeeName, String period) {
        String subject = "\uD83C\uDFAF Target CRUSHED!";
        String html = EmailTemplates.targetAchieved(employeeName, period, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendWeeklyPerformanceSummaryEmail(String to, String employeeName, int dealsClosed, String revenue) {
        String subject = "Weekly Performance Wrap-Up \uD83D\uDCCA";
        String html = EmailTemplates.weeklyPerformanceSummary(employeeName, dealsClosed, revenue, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendCommissionPaidEmail(String to, String employeeName, String amount) {
        String subject = "Commission Transferred \uD83D\uDCB0";
        String html = EmailTemplates.commissionPaid(employeeName, amount, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", fromName);
            sender.put("email", from);

            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", to);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", sender);
            body.put("to", List.of(recipient));
            body.put("subject", subject);
            body.put("htmlContent", htmlBody);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email successfully dispatched to {} via Brevo API | Subject: {}", to, subject);
            } else {
                log.error("Brevo API error: {}", response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
