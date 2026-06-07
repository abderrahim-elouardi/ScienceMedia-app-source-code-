package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.NotificationDTO;
import com.fsdm.wisd.scienceMedia.dto.PaginatedResponse;
import com.fsdm.wisd.scienceMedia.entite.Notification;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.repositories.NotificationRepository;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final int PAGE_SIZE = 20;

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                                UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public PaginatedResponse<NotificationDTO> getNotifications(String cursor, Authentication authentication) {
        int page = (cursor != null && !cursor.isEmpty()) ? Integer.parseInt(cursor) : 0;
        Userr recipient = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Page<Notification> notifPage = notificationRepository
                .findByRecipientOrderByCreatedAtDesc(recipient, PageRequest.of(page, PAGE_SIZE));

        List<NotificationDTO> dtos = notifPage.getContent().stream()
                .map(this::toNotificationDTO)
                .collect(Collectors.toList());

        boolean hasMore = page < notifPage.getTotalPages() - 1;
        String nextCursor = hasMore ? String.valueOf(page + 1) : null;

        return new PaginatedResponse<>(dtos, nextCursor, hasMore);
    }

    @Transactional
    public boolean markAsRead(Long notificationId, Authentication authentication) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
        return true;
    }

    @Transactional
    public boolean markAllAsRead(Authentication authentication) {
        Userr recipient = userRepository.findByEmail(authentication.getName()).orElseThrow();
        notificationRepository.markAllAsReadByRecipient(recipient);
        return true;
    }

    private NotificationDTO toNotificationDTO(Notification n) {
        String actorName = n.getActor() != null ? n.getActor().getUsername() : "System";
        String relativeTime = computeRelativeTime(n.getCreatedAt());

        return new NotificationDTO(
                String.valueOf(n.getId()),
                actorName,
                n.getAction() != null ? n.getAction() : "",
                relativeTime,
                n.isRead(),
                null,
                n.getIconColor() != null ? n.getIconColor() : "#0A66C2",
                n.getIcon() != null ? n.getIcon() : "🔔"
        );
    }

    private String computeRelativeTime(LocalDateTime createdAt) {
        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 1) return "maintenant";
        if (minutes < 60) return minutes + "m ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + "h ago";
        long days = duration.toDays();
        if (days < 7) return days + "d ago";
        return (days / 7) + "w ago";
    }
}
