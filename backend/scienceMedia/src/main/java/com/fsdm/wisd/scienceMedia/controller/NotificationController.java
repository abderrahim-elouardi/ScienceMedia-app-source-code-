package com.fsdm.wisd.scienceMedia.controller;

import com.fsdm.wisd.scienceMedia.dto.NotificationDTO;
import com.fsdm.wisd.scienceMedia.dto.PaginatedResponse;
import com.fsdm.wisd.scienceMedia.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<NotificationDTO>> getNotifications(
            @RequestParam(required = false) String cursor,
            Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotifications(cursor, authentication));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Boolean>> markAsRead(@PathVariable Long id,
                                                           Authentication authentication) {
        boolean success = notificationService.markAsRead(id, authentication);
        return ResponseEntity.ok(Map.of("success", success));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Boolean>> markAllAsRead(Authentication authentication) {
        boolean success = notificationService.markAllAsRead(authentication);
        return ResponseEntity.ok(Map.of("success", success));
    }
}
