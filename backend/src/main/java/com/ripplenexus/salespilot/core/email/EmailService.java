package com.ripplenexus.salespilot.core.email;

public interface EmailService {

    void sendPasswordResetEmail(String to, String resetLink);

    void sendWelcomeEmail(String to, String name, String tempPassword);

    void sendLeadAssignedEmail(String to, String employeeName, String leadName);

    void sendCommissionApprovedEmail(String to, String employeeName, String amount);

    void sendCommissionPaidEmail(String to, String employeeName, String amount);

    void sendMeetingReminderEmail(String to, String employeeName, String meetingTitle,
                                   String scheduledAt, String location);

    void sendFollowUpReminderEmail(String to, String employeeName, String followUpTitle,
                                    String scheduledAt);

    void sendTargetAchievedEmail(String to, String employeeName, String period,
                                  String achievement);

    void sendEmail(String to, String subject, String htmlBody);
}
