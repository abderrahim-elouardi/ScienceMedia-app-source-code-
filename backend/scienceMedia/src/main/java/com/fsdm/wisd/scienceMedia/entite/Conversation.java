package com.fsdm.wisd.scienceMedia.entite;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"participant_one_id", "participant_two_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_one_id", nullable = false)
    private Userr participantOne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_two_id", nullable = false)
    private Userr participantTwo;

    // Aperçu du dernier message pour l'affichage dans la liste
    private String lastMessagePreview;

    private LocalDateTime lastMessageAt;

    // Nombre de messages non lus pour participantOne
    private int unreadCountOne = 0;

    // Nombre de messages non lus pour participantTwo
    private int unreadCountTwo = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
}
