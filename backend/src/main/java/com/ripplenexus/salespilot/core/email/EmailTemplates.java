package com.ripplenexus.salespilot.core.email;

/**
 * Centralized HTML email templates for Sales Pilot.
 * Redesigned for maximum visual excellence, state-of-the-art dark mode aesthetics,
 * and guaranteed portal links to https://salespilot.theripplenexus.com.
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
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&display=swap');
              body { margin:0; padding:0; background-color:#06080F; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#E2E8F0; -webkit-font-smoothing:antialiased; }
              .wrapper { width:100%%; table-layout:fixed; background-color:#06080F; padding:40px 0; }
              .container { max-width:620px; margin:0 auto; background:#0D111D; border-radius:24px; overflow:hidden; border:1px solid rgba(99,102,241,0.25); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
              .header { background: linear-gradient(135deg, #1E1B4B 0%%, #312E81 50%%, #4C1D95 100%%); padding:40px 40px 32px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.1); position:relative; }
              .logo-box { display:inline-block; background:rgba(255,255,255,0.1); backdrop-filter:blur(10px); padding:10px 22px; border-radius:16px; border:1px solid rgba(255,255,255,0.15); margin-bottom:12px; }
              .logo-text { color:#FFFFFF; font-size:26px; font-weight:900; letter-spacing:2px; margin:0; text-shadow: 0 2px 10px rgba(99,102,241,0.5); }
              .logo-accent { color:#38BDF8; }
              .header p { margin:4px 0 0; color:#93C5FD; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:3px; }
              .body { padding:44px 40px; line-height:1.7; }
              .body h2 { color:#FFFFFF; font-size:24px; margin:0 0 16px; font-weight:800; letter-spacing:-0.5px; }
              .body p { margin:0 0 18px; color:#94A3B8; font-size:15px; }
              .btn-wrapper { text-align:center; margin:36px 0; }
              .btn { display:inline-block; background: linear-gradient(135deg, #3B82F6 0%%, #6366F1 50%%, #8B5CF6 100%%); color:#FFFFFF !important; text-decoration:none; padding:16px 36px; border-radius:14px; font-weight:700; font-size:16px; box-shadow: 0 10px 25px -5px rgba(99,102,241,0.5); border:1px solid rgba(255,255,255,0.2); transition:transform 0.2s; }
              .footer { padding:32px 40px; background:#080A12; border-top:1px solid rgba(255,255,255,0.06); text-align:center; color:#64748B; font-size:13px; }
              .footer a { color:#38BDF8; text-decoration:none; font-weight:600; }
              .highlight { color:#38BDF8; font-weight:700; }
              .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; margin:24px 0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.05); }
              .list { padding-left: 20px; color: #94A3B8; margin-bottom: 24px; font-size:15px; }
              .list li { margin-bottom: 10px; }
            </style>
            </head>
            <body>
            <div class="wrapper">
              <div class="container">
                <div class="header">
                  <div class="logo-box">
                    <p class="logo-text">SALES<span class="logo-accent">PILOT</span></p>
                  </div>
                  <p>Enterprise Revenue Engine &bull; Ripple Nexus</p>
                </div>
                <div class="body">
            """ + content + """
                </div>
                <div class="footer">
                  <p style="margin-bottom:8px; font-weight:700; color:#94A3B8;">SALES PILOT BY RIPPLE NEXUS</p>
                  <p style="margin:0 0 12px;">The Next-Generation AI-Powered Sales Platform</p>
                  <p style="margin:0; font-size:12px;">&copy; 2026 Ripple Nexus. All rights reserved. &bull; <a href="https://salespilot.theripplenexus.com">Portal Access</a></p>
                </div>
              </div>
            </div>
            </body>
            </html>
            """;
    }

    // 1. Welcome / Onboarding
    public static String welcome(String name, String email, String tempPassword, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>Welcome aboard, %s! \ud83d\ude80</h2>
            <p>Your enterprise profile on <strong>Sales Pilot</strong> has been officially created. You now have access to our cutting-edge AI revenue acceleration platform.</p>
            <div class="card" style="background: linear-gradient(135deg, rgba(56,189,248,0.05) 0%%, rgba(99,102,241,0.05) 100%%); border-color: rgba(56,189,248,0.2);">
              <p style="margin:0; font-size:15px; color:#E2E8F0;"><strong>Work Email:</strong> <span style="color:#38BDF8;">%s</span></p>
              <p style="margin:12px 0 0; font-size:15px; color:#E2E8F0;"><strong>Temporary Password:</strong> <span style="background:rgba(255,255,255,0.1); padding:4px 10px; border-radius:6px; font-family:monospace; font-size:16px; color:#F8FAFC; border:1px solid rgba(255,255,255,0.15);">%s</span></p>
            </div>
            <p><strong>Required Onboarding Checklist:</strong></p>
            <ul class="list">
              <li>Log into your portal using your credentials above.</li>
              <li>Complete your Employee Profile &amp; KYC Verification for payout processing.</li>
              <li>Set a new secure password upon your first sign-in.</li>
            </ul>
            <div class="btn-wrapper">
              <a href="%s/login" class="btn">Access Sales Pilot Portal</a>
            </div>
            <p style="font-size:13px; color:#64748B; text-align:center;">Direct URL: <a href="%s/login" style="color:#38BDF8;">%s/login</a></p>
            """.formatted(name, email, tempPassword, url, url, url));
    }

    // 2. OTP Security Code
    public static String otpCode(String code) {
        return baseTemplate("""
            <h2>Security Verification \ud83d\udd12</h2>
            <p>We detected a login attempt to your Sales Pilot account. Please enter the two-factor authentication code below to verify your identity.</p>
            <div class="card" style="text-align:center; background:linear-gradient(135deg, rgba(99,102,241,0.15) 0%%, rgba(139,92,246,0.15) 100%%); border-color:rgba(99,102,241,0.3); padding:32px;">
              <p style="margin:0; font-size:46px; color:#FFFFFF; font-weight:900; letter-spacing:10px; font-family:monospace;">%s</p>
            </div>
            <p style="font-size:13px; text-align:center; color:#94A3B8;">This security token is valid for <strong>10 minutes</strong>.</p>
            <p style="margin-top:24px; font-size:13px; color:#64748B;">If you did not initiate this request, immediately reset your password and notify system administration.</p>
            """.formatted(code));
    }

    // 3. Password Reset Request
    public static String passwordReset(String resetLink) {
        return baseTemplate("""
            <h2>Reset Your Password \ud83d\udd11</h2>
            <p>We received a secure request to reset the password associated with your Sales Pilot account. Click the button below to establish a new credential.</p>
            <div class="btn-wrapper">
              <a href="%s" class="btn">Reset Password Now</a>
            </div>
            <p style="font-size:13px; color:#64748B;">If you did not request a password reset, no action is required. Your account remains secure.</p>
            """.formatted(resetLink));
    }

    // 4. New Lead Assigned
    public static String leadAssigned(String name, String leadName, String company, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>New Opportunity Assigned \ud83c\udfaf</h2>
            <p>Hi %s, a high-value prospect has been assigned to your sales pipeline!</p>
            <div class="card" style="border-left:4px solid #38BDF8;">
              <p style="margin:0; font-size:22px; color:#FFFFFF; font-weight:800;">%s</p>
              <p style="margin:6px 0 0; color:#38BDF8; font-weight:600; font-size:16px;">%s</p>
            </div>
            <p>Speed to lead is critical in closing enterprise deals. Access the CRM now to review their requirements and initiate engagement.</p>
            <div class="btn-wrapper">
              <a href="%s/leads" class="btn">View Lead Pipeline</a>
            </div>
            """.formatted(name, leadName, company, url));
    }

    // 5. Meeting Scheduled
    public static String meetingReminder(String name, String title, String scheduledAt, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>Meeting Scheduled \ud83d\uddd3️</h2>
            <p>Hi %s, a new client engagement session has been added to your calendar.</p>
            <div class="card" style="border-left:4px solid #8B5CF6;">
              <p style="margin:0; font-size:20px; color:#FFFFFF; font-weight:700;">%s</p>
              <p style="margin:8px 0 0; color:#A78BFA; font-weight:600; font-size:15px;">%s</p>
            </div>
            <div class="btn-wrapper">
              <a href="%s/meetings" class="btn">Open Calendar</a>
            </div>
            """.formatted(name, title, scheduledAt, url));
    }

    // 6. Daily Agenda (Cron)
    public static String dailyAgenda(String name, int followUpsCount, int meetingsCount, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>Good Morning, %s! ☕</h2>
            <p>Here is your daily executive summary to help you prioritize your revenue targets today:</p>
            <div class="card" style="display:flex; justify-content:space-around; text-align:center;">
              <div style="margin-bottom:12px;">
                <span style="font-size:32px; font-weight:900; color:#38BDF8; display:block;">%d</span>
                <span style="font-size:13px; color:#94A3B8; text-transform:uppercase; font-weight:700;">Follow-ups Due</span>
              </div>
              <div style="margin-bottom:12px;">
                <span style="font-size:32px; font-weight:900; color:#8B5CF6; display:block;">%d</span>
                <span style="font-size:13px; color:#94A3B8; text-transform:uppercase; font-weight:700;">Meetings Today</span>
              </div>
            </div>
            <p>Let's maintain high momentum and close high-value deals today!</p>
            <div class="btn-wrapper">
              <a href="%s/dashboard" class="btn">Launch Sales Pilot</a>
            </div>
            """.formatted(name, followUpsCount, meetingsCount, url));
    }

    // 7. KYC Status Update
    public static String kycStatusUpdate(String name, String status, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        String emoji = status.equals("VERIFIED") ? "✅" : "⚠️";
        String message = status.equals("VERIFIED") 
            ? "Congratulations! Your KYC verification is complete. Your account is now fully approved for automated commission disbursements and financial payouts." 
            : "We encountered an issue while verifying your submitted KYC documents. Please log into your profile and provide updated documentation.";
        
        return baseTemplate("""
            <h2>KYC Verification Status %s</h2>
            <p>Hi %s,</p>
            <p>%s</p>
            <div class="btn-wrapper">
              <a href="%s/profile" class="btn">Review Employee Profile</a>
            </div>
            """.formatted(emoji, name, message, url));
    }

    // 8. First Deal Closed (Milestone)
    public static String firstDealClosed(String name, String dealName, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>BOOM! First Deal Closed! \ud83c\udf89\ud83c\udf7e</h2>
            <p>Massive congratulations, %s!</p>
            <p>You have successfully closed your very first deal on the Sales Pilot platform:</p>
            <div class="card" style="text-align:center; background: linear-gradient(135deg, rgba(56,189,248,0.1) 0%%, rgba(139,92,246,0.15) 100%%); border-color: rgba(139,92,246,0.3); padding:32px;">
              <p style="margin:0; font-size:26px; color:#FFFFFF; font-weight:900;">%s</p>
            </div>
            <p>This milestone marks the beginning of an outstanding sales trajectory. Keep leading and stacking those commissions!</p>
            <div class="btn-wrapper">
              <a href="%s/deals" class="btn">View Deal Pipeline</a>
            </div>
            """.formatted(name, dealName, url));
    }

    // 9. Quota / Target Reached (Milestone)
    public static String targetAchieved(String name, String period, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>\ud83c\udfaf Quota Exceeded!</h2>
            <p>Incredible performance, %s!</p>
            <p>You have officially crossed <strong>100%% of your assigned sales quota</strong> for %s. Your commitment to excellence is driving significant revenue growth.</p>
            <div class="card" style="text-align:center; background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%%, rgba(5,150,105,0.15) 100%%); border-color: rgba(16,185,129,0.3); padding:32px;">
              <p style="margin:0; font-size:54px; color:#10B981; font-weight:900;">100%%+</p>
              <p style="margin:4px 0 0; color:#E2E8F0; font-weight:700; text-transform:uppercase; letter-spacing:2px;">Target Achieved</p>
            </div>
            <p>Celebrate this milestone and continue pushing the ceiling!</p>
            <div class="btn-wrapper">
              <a href="%s/targets" class="btn">View Performance Board</a>
            </div>
            """.formatted(name, period, url));
    }

    // 10. Weekly Performance Summary (Cron)
    public static String weeklyPerformanceSummary(String name, int dealsClosed, String revenue, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>Weekly Wrap-Up \ud83d\udcca</h2>
            <p>Hi %s, here is an executive breakdown of your sales production this week:</p>
            <div class="card">
              <ul class="list" style="margin:0;">
                <li style="margin-bottom:14px;">Deals Closed: <strong style="color:#FFFFFF; font-size:18px;">%d</strong></li>
                <li>Revenue Generated: <strong style="color:#10B981; font-size:18px;">%s</strong></li>
              </ul>
            </div>
            <p>Review your full analytics report to optimize next week's pipeline strategy.</p>
            <div class="btn-wrapper">
              <a href="%s/dashboard" class="btn">View Analytics Dashboard</a>
            </div>
            """.formatted(name, dealsClosed, revenue, url));
    }

    // 11. Commission Paid Notification
    public static String commissionPaid(String name, String amount, String frontendUrl) {
        String url = resolveUrl(frontendUrl);
        return baseTemplate("""
            <h2>Commission Disbursed! \ud83d\udcb0</h2>
            <p>Hi %s, your earnings payout has been successfully authorized and transferred to your registered bank account.</p>
            <div class="card" style="text-align:center; background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%%, rgba(56,189,248,0.15) 100%%); border-color: rgba(16,185,129,0.3); padding:32px;">
              <p style="margin:0; font-size:42px; color:#10B981; font-weight:900;">%s</p>
              <p style="margin:6px 0 0; color:#94A3B8; font-weight:700; text-transform:uppercase; letter-spacing:2px;">Transferred to Bank</p>
            </div>
            <p>Your hard work and dedication drive our shared success. Thank you for your leadership!</p>
            <div class="btn-wrapper">
              <a href="%s/payouts" class="btn">View Financial Ledger</a>
            </div>
            """.formatted(name, amount, url));
    }
}
