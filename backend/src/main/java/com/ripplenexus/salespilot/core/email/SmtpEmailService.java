package com.ripplenexus.salespilot.core.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${salespilot.email.from}")
    private String from;

    @Value("${salespilot.email.from-name}")
    private String fromName;

    @Value("${salespilot.frontend-url}")
    private String frontendUrl;

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String resetLink) {
        String subject = "Reset your Sales Pilot password";
        String html = EmailTemplates.passwordReset(resetLink, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendWelcomeEmail(String to, String name, String tempPassword) {
        String subject = "Welcome to Sales Pilot — Your account is ready";
        String html = EmailTemplates.welcome(name, to, tempPassword, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendLeadAssignedEmail(String to, String employeeName, String leadName) {
        String subject = "New Lead Assigned: " + leadName;
        String html = EmailTemplates.leadAssigned(employeeName, leadName, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendCommissionApprovedEmail(String to, String employeeName, String amount) {
        String subject = "Commission Approved — " + amount;
        String html = EmailTemplates.commissionApproved(employeeName, amount, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendCommissionPaidEmail(String to, String employeeName, String amount) {
        String subject = "Commission Paid — " + amount;
        String html = EmailTemplates.commissionPaid(employeeName, amount, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendMeetingReminderEmail(String to, String employeeName, String meetingTitle,
                                          String scheduledAt, String location) {
        String subject = "Meeting Reminder: " + meetingTitle;
        String html = EmailTemplates.meetingReminder(employeeName, meetingTitle, scheduledAt, location, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendFollowUpReminderEmail(String to, String employeeName, String followUpTitle,
                                           String scheduledAt) {
        String subject = "Follow-up Reminder: " + followUpTitle;
        String html = EmailTemplates.followUpReminder(employeeName, followUpTitle, scheduledAt, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendTargetAchievedEmail(String to, String employeeName, String period,
                                         String achievement) {
        String subject = "🎉 Target Achieved — " + achievement + "%";
        String html = EmailTemplates.targetAchieved(employeeName, period, achievement, frontendUrl);
        sendEmail(to, subject, html);
    }

    @Override
    @Async
    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.debug("Email sent to: {} | Subject: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
