package com.ripplenexus.salespilot.notification.presentation;

import com.ripplenexus.salespilot.auth.domain.User;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.notification.application.NotificationService;
import com.ripplenexus.salespilot.notification.domain.Notification;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notifications", description = "User notifications and alerts management")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Operation(summary = "Get current user notifications")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Notification>>> getMyNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Notification> notifPage = notificationService.getByUser(user.getId(), unreadOnly, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(notifPage)));
    }

    @Operation(summary = "Get count of unread notifications")
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        long count = notificationService.countUnread(user.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @Operation(summary = "Mark single notification as read")
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        notificationService.markRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @Operation(summary = "Mark all notifications as read")
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @Operation(summary = "Delete a specific notification")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        notificationService.delete(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }

    @Operation(summary = "Delete all notifications for current user")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications(@AuthenticationPrincipal User user) {
        notificationService.deleteAll(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared", null));
    }
}
