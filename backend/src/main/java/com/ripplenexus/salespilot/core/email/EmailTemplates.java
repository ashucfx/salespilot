package com.ripplenexus.salespilot.core.email;

/**
 * Centralized HTML email templates for Sales Pilot.
 * All emails follow a consistent branded design for the 11-step engagement flow.
 */
public class EmailTemplates {

    private static String baseTemplate(String content) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sales Pilot</title>
            <style>
              body { margin:0; padding:0; background:#0f0f1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
              .container { max-width:600px; margin:40px auto; background:#1a1a2e; border-radius:16px; overflow:hidden; border:1px solid rgba(99,102,241,0.2); }
              .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding:32px 40px; text-align:center; }
              .header h1 { margin:0; color:#fff; font-size:28px; font-weight:900; letter-spacing:-0.5px; }
              .header p { margin:4px 0 0; color:rgba(255,255,255,0.8); font-size:14px; text-transform:uppercase; letter-spacing:1px; }
              .body { padding:40px; color:#e2e8f0; line-height:1.7; }
              .body h2 { color:#f1f5f9; font-size:22px; margin:0 0 16px; font-weight:700; }
              .body p { margin:0 0 16px; color:#94a3b8; }
              .btn { display:inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color:#fff !important; text-decoration:none; padding:14px 32px; border-radius:10px; font-weight:600; font-size:15px; margin:16px 0; box-shadow: 0 4px 14px 0 rgba(99,102,241,0.39); }
              .footer { padding:24px 40px; border-top:1px solid rgba(255,255,255,0.05); text-align:center; color:#4a5568; font-size:12px; }
              .highlight { color:#8b5cf6; font-weight:600; }
              .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:20px; margin:16px 0; }
              .list { padding-left: 20px; color: #94a3b8; margin-bottom: 20px; }
              .list li { margin-bottom: 8px; }
            </style>
            </head>
            <body>
            <div class="container">
              <div class="header">
                <h1>SALES PILOT</h1>
                <p>Lead. Close. Grow.</p>
              </div>
              <div class="body">
            """ + content + """
              </div>
              <div class="footer">
                <p>&copy; 2026 Sales Pilot by Ripple Nexus. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
            </body>
            </html>
            """;
    }

    // 1. Welcome / Onboarding
    public static String welcome(String name, String email, String tempPassword, String frontendUrl) {
        return baseTemplate("""
            <h2>Welcome to the team, %s! 🚀</h2>
            <p>Your Sales Pilot account has been created. We're thrilled to have you onboard.</p>
            <div class="card">
              <p style="margin:0; font-size:14px;"><strong>Your Email:</strong> %s</p>
              <p style="margin:8px 0 0; font-size:14px;"><strong>Temporary Password:</strong> <span class="highlight">%s</span></p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <ul class="list">
              <li>Log in using the credentials above.</li>
              <li>Upload your KYC documents for payout processing.</li>
              <li>Change your temporary password.</li>
            </ul>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/login" class="btn">Log In Now</a>
            </div>
            """.formatted(name, email, tempPassword, frontendUrl));
    }

    // 2. OTP Security Code
    public static String otpCode(String code) {
        return baseTemplate("""
            <h2>Security Verification 🔒</h2>
            <p>You recently attempted to sign in. Please use the verification code below to complete your login.</p>
            <div class="card" style="text-align:center; background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.2);">
              <p style="margin:0; font-size:42px; color:#fff; font-weight:800; letter-spacing:8px;">%s</p>
            </div>
            <p style="font-size:13px; text-align:center;">This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            """.formatted(code));
    }

    // 3. Password Reset Request
    public static String passwordReset(String resetLink) {
        return baseTemplate("""
            <h2>Reset Your Password 🔑</h2>
            <p>We received a request to reset your password. Click the button below to choose a new one.</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s" class="btn">Reset Password</a>
            </div>
            <p>If you didn't request a password reset, your account is still secure and you can ignore this email.</p>
            """.formatted(resetLink));
    }

    // 4. New Lead Assigned
    public static String leadAssigned(String name, String leadName, String company, String frontendUrl) {
        return baseTemplate("""
            <h2>New Lead Assigned 🎯</h2>
            <p>Hi %s, a hot new lead has just been dropped into your pipeline!</p>
            <div class="card">
              <p style="margin:0; font-size:20px; color:#fff; font-weight:700;">%s</p>
              <p style="margin:4px 0 0; color:#cbd5e1;">%s</p>
            </div>
            <p>Log in now to view their details and initiate contact. Speed to lead is everything!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/leads" class="btn">View Lead Details</a>
            </div>
            """.formatted(name, leadName, company, frontendUrl));
    }

    // 5. Meeting Scheduled
    public static String meetingReminder(String name, String title, String scheduledAt, String frontendUrl) {
        return baseTemplate("""
            <h2>Meeting Scheduled 🗓️</h2>
            <p>Hi %s, a new meeting has been scheduled.</p>
            <div class="card">
              <p style="margin:0; font-size:18px; color:#fff; font-weight:600;">%s</p>
              <p style="margin:8px 0 0; color:#8b5cf6; font-weight:600;">%s</p>
            </div>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/meetings" class="btn">View Calendar</a>
            </div>
            """.formatted(name, title, scheduledAt, frontendUrl));
    }

    // 6. Daily Agenda (Cron)
    public static String dailyAgenda(String name, int followUpsCount, int meetingsCount, String frontendUrl) {
        return baseTemplate("""
            <h2>Good Morning, %s! ☕</h2>
            <p>Here is your daily agenda to help you crush your targets today:</p>
            <div class="card">
              <ul class="list" style="margin:0;">
                <li><span class="highlight">%d</span> Follow-ups due today</li>
                <li><span class="highlight">%d</span> Meetings scheduled</li>
              </ul>
            </div>
            <p>Let's close some deals today!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/dashboard" class="btn">Open Dashboard</a>
            </div>
            """.formatted(name, followUpsCount, meetingsCount, frontendUrl));
    }

    // 7. KYC Status Update
    public static String kycStatusUpdate(String name, String status, String frontendUrl) {
        String emoji = status.equals("VERIFIED") ? "✅" : "⚠️";
        String message = status.equals("VERIFIED") 
            ? "Great news! Your KYC documents have been verified. You are now fully eligible for payouts." 
            : "There was an issue verifying your KYC documents. Please log in and re-submit them as soon as possible.";
        
        return baseTemplate("""
            <h2>KYC Status Update %s</h2>
            <p>Hi %s,</p>
            <p>%s</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/profile" class="btn">View Profile</a>
            </div>
            """.formatted(emoji, name, message, frontendUrl));
    }

    // 8. First Deal Closed (Milestone)
    public static String firstDealClosed(String name, String dealName, String frontendUrl) {
        return baseTemplate("""
            <h2>BOOM! First Deal Closed! 🎉🍾</h2>
            <p>Massive congratulations, %s!</p>
            <p>You just closed your very first deal on Sales Pilot:</p>
            <div class="card" style="text-align:center; background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%%, rgba(139,92,246,0.1) 100%%);">
              <p style="margin:0; font-size:24px; color:#fff; font-weight:800;">%s</p>
            </div>
            <p>This is just the beginning. Keep up the momentum and let's stack those commissions!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/deals" class="btn">View Deal Pipeline</a>
            </div>
            """.formatted(name, dealName, frontendUrl));
    }

    // 9. Quota / Target Reached (Milestone)
    public static String targetAchieved(String name, String period, String frontendUrl) {
        return baseTemplate("""
            <h2>🎯 Target CRUSHED!</h2>
            <p>Incredible work, %s!</p>
            <p>You have officially crossed 100%% of your sales target for %s. Your dedication and hard work are paying off.</p>
            <div class="card" style="text-align:center;">
              <p style="margin:0; font-size:48px; color:#10b981; font-weight:800;">100%%+</p>
              <p style="margin:4px 0 0; color:#94a3b8; font-weight:600; text-transform:uppercase;">Quota Achieved</p>
            </div>
            <p>Take a moment to celebrate, then let's see how far past the goal you can go!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/targets" class="btn">View Target Board</a>
            </div>
            """.formatted(name, period, frontendUrl));
    }

    // 10. Weekly Performance Summary (Cron)
    public static String weeklyPerformanceSummary(String name, int dealsClosed, String revenue, String frontendUrl) {
        return baseTemplate("""
            <h2>Weekly Wrap-Up 📊</h2>
            <p>Hi %s, here is a quick summary of your performance this week:</p>
            <div class="card">
              <ul class="list" style="margin:0;">
                <li>Deals Closed: <strong style="color:#fff;">%d</strong></li>
                <li>Revenue Generated: <strong style="color:#10b981;">%s</strong></li>
              </ul>
            </div>
            <p>Rest up this weekend and get ready to crush it again on Monday!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/dashboard" class="btn">View Full Reports</a>
            </div>
            """.formatted(name, dealsClosed, revenue, frontendUrl));
    }

    // 11. Commission Paid Notification
    public static String commissionPaid(String name, String amount, String frontendUrl) {
        return baseTemplate("""
            <h2>Check Your Bank! 💰</h2>
            <p>Hi %s, your commission payout has been successfully processed.</p>
            <div class="card" style="text-align:center;">
              <p style="margin:0; font-size:36px; color:#10b981; font-weight:800;">%s</p>
              <p style="margin:4px 0 0; color:#94a3b8; font-weight:600; text-transform:uppercase;">Transferred</p>
            </div>
            <p>Your hard work is appreciated. Keep leading and closing!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/payouts" class="btn">View Payout History</a>
            </div>
            """.formatted(name, amount, frontendUrl));
    }
}
