package com.fsdm.wisd.scienceMedia.controller.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    // Stocke les sessions avec l'ID utilisateur comme clé
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode jsonMessage = objectMapper.readTree(message.getPayload());
        String type = jsonMessage.get("type").asText();

        // 1. Enregistrement initial de l'utilisateur
        if ("store_user".equals(type)) {
            String userId = jsonMessage.get("userId").asText();
            sessions.put(userId, session);
            return;
        }

        // 2. Relais des messages (offer, answer, candidate) vers le destinataire
        String targetId = jsonMessage.get("targetId").asText();
        WebSocketSession targetSession = sessions.get(targetId);

        if (targetSession != null && targetSession.isOpen()) {
            targetSession.sendMessage(new TextMessage(message.getPayload()));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.values().remove(session);
    }
}
