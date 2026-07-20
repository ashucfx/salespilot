package com.ripplenexus.salespilot.core.email;

public interface EmailService {

    void sendWelcomeEmail(String to, String name, String tempPassword);

    void sendOtpEmail(String to, String otpCode);

    void sendPasswordResetEmail(String to, String resetLink);

    void sendLeadAssignedEmail(String to, String employeeName, String leadName, String company);

    void sendMeetingReminderEmail(String to, String employeeName, String meetingTitle, String scheduledAt);

    void sendDailyAgendaEmail(String to, String employeeName, int followUpsCount, int meetingsCount);

    void sendKycStatusUpdateEmail(String to, String employeeName, String status);

    void sendFirstDealClosedEmail(String to, String employeeName, String dealName);

    void sendTargetAchievedEmail(String to, String employeeName, String period);

    void sendWeeklyPerformanceSummaryEmail(String to, String employeeName, int dealsClosed, String revenue);

    void sendCommissionPaidEmail(String to, String employeeName, String amount);

    void sendEmail(String to, String subject, String htmlBody);
}
