package com.ripplenexus.salespilot.core.email;

/**
 * Centralized HTML email templates for Sales Pilot.
 * 100% inline CSS styling to guarantee visual perfection, gradients, rich colors,
 * modern cards, and logo banners in all email clients (Gmail, Outlook, Apple Mail)
 * without stylesheet stripping. Directs all portal access to https://salespilot.theripplenexus.com.
 */
public class EmailTemplates {

    private static String resolveUrl(String frontendUrl) {
        if (frontendUrl == null || frontendUrl.isBlank() || frontendUrl.contains("vercel") || frontendUrl.contains("localhost")) {
            return "https://salespilot.theripplenexus.com";
        }
        return frontendUrl;
    }

    private static String baseTemplate(String content) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sales Pilot by Ripple Nexus</title>
            </head>
            <body style="margin:0; padding:0; background-color:#06080F; font-family:'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color:#E2E8F0; -webkit-font-smoothing:antialiased;">
              <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background-color:#06080F; padding:40px 15px; width:100%%;">
                <tr>
                  <td align="center">
                    <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#0D111D; border-radius:20px; border:1px solid #26334D; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);">
                      <!-- Header Banner -->
                      <tr>
                        <td align="center" style="background:linear-gradient(135deg, #1E1B4B 0%%, #312E81 50%%, #4C1D95 100%%); padding:36px 30px 28px; border-bottom:1px solid #334155;">
                          <div style="display:inline-block; background-color:#151C2F; padding:10px 24px; border-radius:14px; border:1px solid #475569; margin-bottom:10px; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                            <span style="color:#FFFFFF; font-size:26px; font-weight:900; letter-spacing:3px;">SALES<span style="color:#38BDF8;">PILOT</span></span>
                          </div>
                          <p style="margin:4px 0 0; color:#93C5FD; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:3px;">Enterprise Revenue Engine &bull; Ripple Nexus</p>
                        </td>
                      </tr>
                      <!-- Body Content -->
                      <tr>
                        <td style="padding:40px 32px; line-height:1.7; font-size:15px; color:#94A3B8;">
                          """ + content + """
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td align="center" style="padding:28px 30px; background-color:#080A12; border-top:1px solid #1E293B; color:#64748B; font-size:12px;">
                          <p style="margin:0 0 6px; font-weight:700; color:#94A3B8; letter-spacing:1px;">SALES PILOT BY RIPPLE NEXUS</p>
                          <p style="margin:0 0 12px;">The Next-Generation AI-Powered Sales Acceleration Platform</p>
                          <p style="margin:0;">&copy; 2026 Ripple Nexus. All rights reserved. &bull; <a href="https://salespilot.theripplenexus.com" style="color:#38BDF8; text-decoration:none; font-weight:600;">Portal Access</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """;
    }

    // 1. Welcome / Onboarding
    public static String welcome(String name, String email, String tempPassword, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px; letter-spacing:-0.5px;">Welcome aboard, %s! \ud83d\ude80</h2>
            <p style="margin:0 0 18px; color:#94A3B8;">Your enterprise profile on <strong style="color:#FFFFFF;">Sales Pilot</strong> has been officially created. You now have full access to our cutting-edge AI revenue acceleration platform.</p>
            <div style="background-color:#151C2F; border:1px solid #26334D; border-radius:14px; padding:24px; margin:24px 0; border-left:4px solid #38BDF8;">
              <p style="margin:0; font-size:15px; color:#E2E8F0;"><strong style="color:#FFFFFF;">Work Email:</strong> <span style="color:#38BDF8;">%s</span></p>
              <p style="margin:14px 0 0; font-size:15px; color:#E2E8F0;"><strong style="color:#FFFFFF;">Temporary Password:</strong> <span style="background-color:#080A12; padding:6px 12px; border-radius:8px; font-family:monospace; font-size:16px; color:#F8FAFC; border:1px solid #334155; margin-left:8px;">%s</span></p>
            </div>
            <p style="margin:0 0 12px; color:#E2E8F0; font-weight:700;">Required Onboarding Checklist:</p>
            <ul style="padding-left:20px; color:#94A3B8; margin:0 0 28px;">
              <li style="margin-bottom:8px;">Log into your portal using your secure credentials above.</li>
              <li style="margin-bottom:8px;">Complete your Employee Profile &amp; KYC Verification for payout processing.</li>
              <li style="margin-bottom:8px;">Set a new secure password upon your first sign-in.</li>
            </ul>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/login" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; box-shadow:0 10px 25px -5px rgba(99,102,241,0.5); border:1px solid rgba(255,255,255,0.2);">Access Sales Pilot Portal</a>
            </div>
            <p style="font-size:13px; color:#64748B; text-align:center; margin:0;">Direct Portal URL: <a href="%s/login" style="color:#38BDF8; text-decoration:none;">%s/login</a></p>
            """.formatted(name, email, tempPassword, url, url, url));
    }

    // 2. OTP Security Code
    public static String otpCode(String code) {
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">Security Verification \ud83d\udd12</h2>
            <p style="margin:0 0 20px; color:#94A3B8;">We detected a sensitive action or login attempt on your Sales Pilot account. Please enter the two-factor authentication code below to verify your identity.</p>
            <div style="text-align:center; background-color:#151C2F; border:1px solid #3730A3; border-radius:16px; padding:32px; margin:28px 0; box-shadow:inset 0 2px 10px rgba(99,102,241,0.2);">
              <p style="margin:0; font-size:42px; color:#FFFFFF; font-weight:900; letter-spacing:10px; font-family:monospace;">%s</p>
            </div>
            <p style="font-size:13px; text-align:center; color:#94A3B8; margin:0 0 16px;">This security token expires in <strong style="color:#FFFFFF;">10 minutes</strong>.</p>
            <p style="font-size:13px; color:#64748B; text-align:center; margin:0;">If you did not initiate this request, please reset your password immediately and notify system administration.</p>
            """.formatted(code));
    }

    // 3. Password Reset Request
    public static String passwordReset(String resetLink) {
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">Reset Your Password \ud83d\udd11</h2>
            <p style="margin:0 0 24px; color:#94A3B8;">We received a secure request to reset the password associated with your Sales Pilot account. Click the button below to establish a new credential.</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; box-shadow:0 10px 25px -5px rgba(99,102,241,0.5); border:1px solid rgba(255,255,255,0.2);">Reset Password Now</a>
            </div>
            <p style="font-size:13px; color:#64748B; text-align:center; margin:0;">If you did not request a password reset, no action is required. Your account remains secure.</p>
            """.formatted(resetLink));
    }

    // 4. New Lead Assigned
    public static String leadAssigned(String name, String leadName, String company, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">New Opportunity Assigned \ud83c\udfaf</h2>
            <p style="margin:0 0 20px; color:#94A3B8;">Hi <strong style="color:#FFFFFF;">%s</strong>, a high-value prospect has been assigned to your sales pipeline!</p>
            <div style="background-color:#151C2F; border:1px solid #26334D; border-radius:14px; padding:24px; margin:24px 0; border-left:4px solid #38BDF8;">
              <p style="margin:0; font-size:20px; color:#FFFFFF; font-weight:800;">%s</p>
              <p style="margin:6px 0 0; color:#38BDF8; font-weight:600; font-size:15px;">%s</p>
            </div>
            <p style="margin:0 0 28px; color:#94A3B8;">Speed to lead is critical in closing enterprise deals. Access the CRM now to review their requirements and initiate engagement.</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/leads" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">View Lead Pipeline</a>
            </div>
            """.formatted(name, leadName, company, url));
    }

    // 5. Meeting Scheduled
    public static String meetingReminder(String name, String title, String scheduledAt, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">Meeting Scheduled \ud83d\uddd3️</h2>
            <p style="margin:0 0 20px; color:#94A3B8;">Hi <strong style="color:#FFFFFF;">%s</strong>, a new client engagement session has been added to your calendar.</p>
            <div style="background-color:#151C2F; border:1px solid #26334D; border-radius:14px; padding:24px; margin:24px 0; border-left:4px solid #8B5CF6;">
              <p style="margin:0; font-size:18px; color:#FFFFFF; font-weight:700;">%s</p>
              <p style="margin:8px 0 0; color:#A78BFA; font-weight:600; font-size:14px;">%s</p>
            </div>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/meetings" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">Open Calendar</a>
            </div>
            """.formatted(name, title, scheduledAt, url));
    }

    // 6. Daily Agenda (Cron)
    public static String dailyAgenda(String name, int followUpsCount, int meetingsCount, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">Good Morning, %s! ☕</h2>
            <p style="margin:0 0 20px; color:#94A3B8;">Here is your daily executive summary to help you prioritize your revenue targets today:</p>
            <table width="100%%" cellpadding="0" cellspacing="0" border="0" style="background-color:#151C2F; border:1px solid #26334D; border-radius:14px; padding:24px; margin:24px 0;">
              <tr>
                <td align="center" width="50%%" style="border-right:1px solid #26334D; padding:10px;">
                  <span style="font-size:32px; font-weight:900; color:#38BDF8; display:block;">%d</span>
                  <span style="font-size:12px; color:#94A3B8; text-transform:uppercase; font-weight:700; letter-spacing:1px;">Follow-ups Due</span>
                </td>
                <td align="center" width="50%%" style="padding:10px;">
                  <span style="font-size:32px; font-weight:900; color:#8B5CF6; display:block;">%d</span>
                  <span style="font-size:12px; color:#94A3B8; text-transform:uppercase; font-weight:700; letter-spacing:1px;">Meetings Today</span>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 28px; color:#94A3B8; text-align:center;">Let's maintain high momentum and close high-value deals today!</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/dashboard" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">Launch Sales Pilot</a>
            </div>
            """.formatted(name, followUpsCount, meetingsCount, url));
    }

    // 7. KYC Status Update
    public static String kycStatusUpdate(String name, String status, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        String emoji = status.equals("VERIFIED") ? "✅" : "⚠️";
        String border = status.equals("VERIFIED") ? "#10B981" : "#F59E0B";
        String message = status.equals("VERIFIED") 
            ? "Congratulations! Your KYC verification is complete. Your account is now fully approved for automated commission disbursements and financial payouts." 
            : "We encountered an issue while verifying your submitted KYC documents. Please log into your profile and provide updated documentation.";
        
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">KYC Verification Status %s</h2>
            <p style="margin:0 0 16px; color:#94A3B8;">Hi <strong style="color:#FFFFFF;">%s</strong>,</p>
            <div style="background-color:#151C2F; border:1px solid #26334D; border-radius:14px; padding:24px; margin:24px 0; border-left:4px solid %s;">
              <p style="margin:0; font-size:15px; color:#E2E8F0; line-height:1.6;">%s</p>
            </div>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/profile" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">Review Employee Profile</a>
            </div>
            """.formatted(emoji, name, border, message, url));
    }

    // 8. First Deal Closed (Milestone)
    public static String firstDealClosed(String name, String dealName, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">BOOM! First Deal Closed! \ud83c\udf89\ud83c\udf7e</h2>
            <p style="margin:0 0 16px; color:#94A3B8;">Massive congratulations, <strong style="color:#FFFFFF;">%s</strong>!</p>
            <p style="margin:0 0 20px; color:#94A3B8;">You have successfully closed your very first deal on the Sales Pilot platform:</p>
            <div style="text-align:center; background:linear-gradient(135deg, rgba(56,189,248,0.1) 0%%, rgba(139,92,246,0.15) 100%%); border:1px solid #4F46E5; border-radius:16px; padding:32px; margin:24px 0;">
              <p style="margin:0; font-size:24px; color:#FFFFFF; font-weight:900;">%s</p>
            </div>
            <p style="margin:0 0 28px; color:#94A3B8; text-align:center;">This milestone marks the beginning of an outstanding sales trajectory. Keep leading and stacking those commissions!</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/deals" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">View Deal Pipeline</a>
            </div>
            """.formatted(name, dealName, url));
    }

    // 9. Quota / Target Reached (Milestone)
    public static String targetAchieved(String name, String period, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">\ud83c\udfaf Quota Exceeded!</h2>
            <p style="margin:0 0 16px; color:#94A3B8;">Incredible performance, <strong style="color:#FFFFFF;">%s</strong>!</p>
            <p style="margin:0 0 20px; color:#94A3B8;">You have officially crossed <strong style="color:#10B981;">100%% of your assigned sales quota</strong> for %s. Your commitment to excellence is driving significant revenue growth.</p>
            <div style="text-align:center; background:linear-gradient(135deg, rgba(16,185,129,0.1) 0%%, rgba(5,150,105,0.2) 100%%); border:1px solid #10B981; border-radius:16px; padding:32px; margin:24px 0;">
              <p style="margin:0; font-size:52px; color:#10B981; font-weight:900;">100%%+</p>
              <p style="margin:4px 0 0; color:#E2E8F0; font-weight:700; text-transform:uppercase; letter-spacing:2px; font-size:14px;">Target Achieved</p>
            </div>
            <p style="margin:0 0 28px; color:#94A3B8; text-align:center;">Celebrate this milestone and continue pushing the ceiling!</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/targets" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">View Performance Board</a>
            </div>
            """.formatted(name, period, url));
    }

    // 10. Weekly Performance Summary (Cron)
    public static String weeklyPerformanceSummary(String name, int dealsClosed, String revenue, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">Weekly Wrap-Up \ud83d\udcca</h2>
            <p style="margin:0 0 20px; color:#94A3B8;">Hi <strong style="color:#FFFFFF;">%s</strong>, here is an executive breakdown of your sales production this week:</p>
            <div style="background-color:#151C2F; border:1px solid #26334D; border-radius:14px; padding:24px; margin:24px 0;">
              <ul style="padding-left:20px; color:#94A3B8; margin:0;">
                <li style="margin-bottom:12px; font-size:15px;">Deals Closed: <strong style="color:#FFFFFF; font-size:18px;">%d</strong></li>
                <li style="font-size:15px;">Revenue Generated: <strong style="color:#10B981; font-size:18px;">%s</strong></li>
              </ul>
            </div>
            <p style="margin:0 0 28px; color:#94A3B8;">Review your full analytics report to optimize next week's pipeline strategy.</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/dashboard" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">View Analytics Dashboard</a>
            </div>
            """.formatted(name, dealsClosed, revenue, url));
    }

    // 11. Commission Paid Notification
    public static String commissionPaid(String name, String amount, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2 style="color:#FFFFFF; font-size:24px; font-weight:800; margin:0 0 16px;">Commission Disbursed! \ud83d\udcb0</h2>
            <p style="margin:0 0 20px; color:#94A3B8;">Hi <strong style="color:#FFFFFF;">%s</strong>, your earnings payout has been successfully authorized and transferred to your registered bank account.</p>
            <div style="text-align:center; background:linear-gradient(135deg, rgba(16,185,129,0.15) 0%%, rgba(56,189,248,0.15) 100%%); border:1px solid #10B981; border-radius:16px; padding:32px; margin:24px 0;">
              <p style="margin:0; font-size:42px; color:#10B981; font-weight:900;">%s</p>
              <p style="margin:6px 0 0; color:#94A3B8; font-weight:700; text-transform:uppercase; letter-spacing:2px; font-size:12px;">Transferred to Bank</p>
            </div>
            <p style="margin:0 0 28px; color:#94A3B8; text-align:center;">Your hard work and dedication drive our shared success. Thank you for your leadership!</p>
            <div style="text-align:center; margin:36px 0;">
              <a href="%s/payouts" style="display:inline-block; background:linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:12px; font-weight:700; font-size:16px; border:1px solid rgba(255,255,255,0.2);">View Financial Ledger</a>
            </div>
            """.formatted(name, amount, url));
    }
}
