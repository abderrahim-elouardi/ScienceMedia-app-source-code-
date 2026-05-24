package com.fsdm.wisd.scienceMedia.entite;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private Userr recipient;

    // L'utilisateur qui a déclenché la notification (null si système)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private Userr actor;

    private String action;

    private boolean read = false;

    private String iconColor;
    private String icon;

    private boolean isSystem = false;
    private String systemIcon;

    private LocalDateTime createdAt = LocalDateTime.now();
}
