package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Conversation;
import com.fsdm.wisd.scienceMedia.entite.Message;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // Messages d'une conversation, du plus récent au plus ancien
    Page<Message> findByConversationOrderBySentAtDesc(Conversation conversation, Pageable pageable);

    // Nombre de messages non lus envoyés par l'autre utilisateur
    long countByConversationAndSenderNotAndReadFalse(Conversation conversation, Userr sender);

    // Marquer tous les messages reçus comme lus
    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.conversation = :conversation AND m.sender != :reader AND m.read = false")
    void markAllAsRead(@Param("conversation") Conversation conversation, @Param("reader") Userr reader);
}
