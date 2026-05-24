package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Conversation;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // Trouver la conversation entre deux utilisateurs
    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.participantOne = :u1 AND c.participantTwo = :u2) OR " +
           "(c.participantOne = :u2 AND c.participantTwo = :u1)")
    Optional<Conversation> findBetween(@Param("u1") Userr u1, @Param("u2") Userr u2);

    // Toutes les conversations d'un utilisateur, triées par dernier message
    @Query("SELECT c FROM Conversation c WHERE " +
           "c.participantOne = :user OR c.participantTwo = :user " +
           "ORDER BY c.lastMessageAt DESC")
    Page<Conversation> findAllByUser(@Param("user") Userr user, Pageable pageable);
}
