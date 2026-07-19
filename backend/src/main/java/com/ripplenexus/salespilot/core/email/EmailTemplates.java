package com.ripplenexus.salespilot.core.email;

/**
 * Centralized HTML email templates for Sales Pilot.
 * All emails follow a consistent branded design.
 */
public class EmailTemplates {

    private static final String PRIMARY_COLOR = "#6366f1";
    private static final String BRAND_NAME = "Sales Pilot";
    private static final String BRAND_TAGLINE = "Lead. Close. Grow.";

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
              .header h1 { margin:0; color:#fff; font-size:28px; font-weight:700; letter-spacing:-0.5px; }
              .header p { margin:4px 0 0; color:rgba(255,255,255,0.8); font-size:14px; }
              .body { padding:40px; color:#e2e8f0; line-height:1.7; }
              .body h2 { color:#f1f5f9; font-size:20px; margin:0 0 16px; }
              .body p { margin:0 0 16px; color:#94a3b8; }
              .btn { display:inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color:#fff !important; text-decoration:none; padding:14px 32px; border-radius:10px; font-weight:600; font-size:15px; margin:16px 0; }
              .footer { padding:24px 40px; border-top:1px solid rgba(255,255,255,0.05); text-align:center; color:#4a5568; font-size:12px; }
              .highlight { color:#6366f1; font-weight:600; }
              .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:20px; margin:16px 0; }
            </style>
            </head>
            <body>
            <div class="container">
              <div class="header">
                <h1>Sales Pilot</h1>
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

    public static String passwordReset(String resetLink, String frontendUrl) {
        return baseTemplate("""
            <h2>Reset Your Password</h2>
            <p>You requested a password reset. Click the button below to set a new password.</p>
            <p>This link will expire in <span class="highlight">1 hour</span>.</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s" class="btn">Reset Password</a>
            </div>
            <div class="card">
              <p style="margin:0; font-size:13px;">Or copy this link into your browser:</p>
              <p style="margin:8px 0 0; word-break:break-all; font-size:12px; color:#6366f1;">%s</p>
            </div>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            """.formatted(resetLink, resetLink));
    }

    public static String welcome(String name, String email, String tempPassword, String frontendUrl) {
        return baseTemplate("""
            <h2>Welcome to Sales Pilot, %s! 🎉</h2>
            <p>Your account has been created. Here are your login credentials:</p>
            <div class="card">
              <p style="margin:0;"><strong>Email:</strong> %s</p>
              <p style="margin:8px 0 0;"><strong>Temporary Password:</strong> <span class="highlight">%s</span></p>
            </div>
            <p>Please log in and change your password immediately.</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/auth/login" class="btn">Log In Now</a>
            </div>
            """.formatted(name, email, tempPassword, frontendUrl));
    }

    public static String leadAssigned(String name, String leadName, String frontendUrl) {
        return baseTemplate("""
            <h2>New Lead Assigned to You</h2>
            <p>Hi %s, a new lead has been assigned to you:</p>
            <div class="card">
              <p style="margin:0; font-size:18px; color:#f1f5f9; font-weight:600;">%s</p>
            </div>
            <p>Log in to view lead details, activities, and start the engagement.</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/leads" class="btn">View Lead</a>
            </div>
            """.formatted(name, leadName, frontendUrl));
    }

    public static String commissionApproved(String name, String amount, String frontendUrl) {
        return baseTemplate("""
            <h2>Commission Approved 🎊</h2>
            <p>Great news, %s! Your commission has been approved.</p>
            <div class="card" style="text-align:center;">
              <p style="margin:0; font-size:32px; color:#10b981; font-weight:700;">%s</p>
              <p style="margin:4px 0 0; color:#6b7280; font-size:14px;">Commission Amount</p>
            </div>
            <p>Your commission will be processed for payment soon.</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/commissions" class="btn">View Commissions</a>
            </div>
            """.formatted(name, amount, frontendUrl));
    }

    public static String commissionPaid(String name, String amount, String frontendUrl) {
        return baseTemplate("""
            <h2>Commission Paid ✅</h2>
            <p>Hi %s, your commission of <span class="highlight">%s</span> has been paid!</p>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/commissions" class="btn">View History</a>
            </div>
            """.formatted(name, amount, frontendUrl));
    }

    public static String meetingReminder(String name, String title, String scheduledAt,
                                          String location, String frontendUrl) {
        return baseTemplate("""
            <h2>Meeting Reminder ⏰</h2>
            <p>Hi %s, you have a meeting scheduled soon.</p>
            <div class="card">
              <p style="margin:0; font-size:18px; color:#f1f5f9; font-weight:600;">%s</p>
              <p style="margin:8px 0 0; color:#6b7280;">📅 %s</p>
              <p style="margin:4px 0 0; color:#6b7280;">📍 %s</p>
            </div>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/meetings" class="btn">View Meeting</a>
            </div>
            """.formatted(name, title, scheduledAt, location != null ? location : "Online", frontendUrl));
    }

    public static String followUpReminder(String name, String title, String scheduledAt,
                                           String frontendUrl) {
        return baseTemplate("""
            <h2>Follow-up Reminder 📞</h2>
            <p>Hi %s, you have a follow-up due.</p>
            <div class="card">
              <p style="margin:0; font-size:18px; color:#f1f5f9; font-weight:600;">%s</p>
              <p style="margin:8px 0 0; color:#6b7280;">📅 %s</p>
            </div>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/followups" class="btn">View Follow-up</a>
            </div>
            """.formatted(name, title, scheduledAt, frontendUrl));
    }

    public static String targetAchieved(String name, String period, String achievement,
                                         String frontendUrl) {
        return baseTemplate("""
            <h2>🎯 Target Achieved!</h2>
            <p>Congratulations %s! You've achieved your %s target.</p>
            <div class="card" style="text-align:center;">
              <p style="margin:0; font-size:48px; color:#10b981; font-weight:700;">%s%%</p>
              <p style="margin:4px 0 0; color:#6b7280;">Achievement</p>
            </div>
            <div style="text-align:center; margin:32px 0;">
              <a href="%s/targets" class="btn">View Targets</a>
            </div>
            """.formatted(name, period, achievement, frontendUrl));
    }
}
