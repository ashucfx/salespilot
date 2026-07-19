package com.ripplenexus.salespilot.notification.application;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.lead.domain.Lead;
import com.ripplenexus.salespilot.notification.domain.Notification;
import com.ripplenexus.salespilot.notification.domain.NotificationType;
import com.ripplenexus.salespilot.notification.infrastructure.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Async
    public void notifyLeadAssigned(User recipient, Lead lead) {
        create(recipient, NotificationType.LEAD_ASSIGNED,
                "New Lead Assigned",
                "A new lead has been assigned to you: " + lead.getContactName()
                        + (lead.getCompanyName() != null ? " from " + lead.getCompanyName() : ""),
                "/leads/" + lead.getId());
    }

    @Async
    public void notifyCommissionApproved(User recipient, String amount) {
        create(recipient, NotificationType.COMMISSION_APPROVED,
                "Commission Approved",
                "Your commission of " + amount + " has been approved.", "/commissions");
    }

    @Async
    public void notifyCommissionPaid(User recipient, String amount) {
        create(recipient, NotificationType.COMMISSION_PAID,
                "Commission Paid",
                "Your commission of " + amount + " has been paid!", "/commissions");
    }

    @Async
    public void notifyCommissionRejected(User recipient, String reason) {
        create(recipient, NotificationType.COMMISSION_REJECTED,
                "Commission Rejected",
                "Your commission was rejected. Reason: " + reason, "/commissions");
    }

    @Async
    public void notifyTargetAchieved(User recipient, String period, String pct) {
        create(recipient, NotificationType.TARGET_ACHIEVED,
                "Target Achieved! 🎯",
                "Congratulations! You've achieved " + pct + "% of your " + period + " target.",
                "/targets");
    }

    public void markRead(UUID notificationId, UUID userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getRecipient().getId().equals(userId)) {
                n.setRead(true);
                n.setReadAt(Instant.now());
                notificationRepository.save(n);
            }
        });
    }

    public void markAllRead(UUID userId) {
        notificationRepository.markAllReadByUser(userId, Instant.now());
    }

    public Page<Notification> getByUser(UUID userId, boolean unreadOnly, Pageable pageable) {
        if (unreadOnly) {
            return notificationRepository.findUnreadByUser(userId, pageable);
        }
        return notificationRepository.findByRecipientId(userId, pageable);
    }

    public long countUnread(UUID userId) {
        return notificationRepository.countUnreadByUser(userId);
    }

    private void create(User recipient, NotificationType type, String title,
                        String message, String actionUrl) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .message(message)
                .actionUrl(actionUrl)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
