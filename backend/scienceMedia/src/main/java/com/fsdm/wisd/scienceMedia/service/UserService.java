package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.PaginatedResponse;
import com.fsdm.wisd.scienceMedia.dto.UserDTO;
import com.fsdm.wisd.scienceMedia.entite.Connection;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.repositories.ConnectionRepository;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final int PAGE_SIZE = 10;

    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;

    public UserService(UserRepository userRepository, ConnectionRepository connectionRepository) {
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
    }

    public PaginatedResponse<UserDTO> getSuggestions(String cursor, Authentication authentication) {
        int page = (cursor != null && !cursor.isEmpty()) ? Integer.parseInt(cursor) : 0;
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Page<Userr> usersPage = userRepository.findAll(PageRequest.of(page, PAGE_SIZE));

        List<UserDTO> dtos = usersPage.getContent().stream()
                .filter(u -> u.getId() != currentUser.getId())
                .map(u -> toUserDTO(u, currentUser))
                .collect(Collectors.toList());

        boolean hasMore = page < usersPage.getTotalPages() - 1;
        String nextCursor = hasMore ? String.valueOf(page + 1) : null;

        return new PaginatedResponse<>(dtos, nextCursor, hasMore);
    }

    @Transactional
    public boolean connectUser(Long targetUserId, Authentication authentication) {
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Userr targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!connectionRepository.existsConnectionBetween(currentUser, targetUser)) {
            Connection connection = new Connection();
            connection.setRequester(currentUser);
            connection.setAddressee(targetUser);
            connectionRepository.save(connection);

            Long followers = targetUser.getNumberOfFollowers() != null ? targetUser.getNumberOfFollowers() + 1 : 1L;
            targetUser.setNumberOfFollowers(followers);
            Long following = currentUser.getNumberOfFollowing() != null ? currentUser.getNumberOfFollowing() + 1 : 1L;
            currentUser.setNumberOfFollowing(following);
            userRepository.save(targetUser);
            userRepository.save(currentUser);
        }
        return true;
    }

    @Transactional
    public boolean disconnectUser(Long targetUserId, Authentication authentication) {
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Userr targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Connection> conn = connectionRepository.findByRequesterAndAddressee(currentUser, targetUser);
        if (conn.isEmpty()) {
            conn = connectionRepository.findByRequesterAndAddressee(targetUser, currentUser);
        }
        conn.ifPresent(c -> {
            connectionRepository.delete(c);
            if (targetUser.getNumberOfFollowers() != null && targetUser.getNumberOfFollowers() > 0)
                targetUser.setNumberOfFollowers(targetUser.getNumberOfFollowers() - 1);
            if (currentUser.getNumberOfFollowing() != null && currentUser.getNumberOfFollowing() > 0)
                currentUser.setNumberOfFollowing(currentUser.getNumberOfFollowing() - 1);
            userRepository.save(targetUser);
            userRepository.save(currentUser);
        });
        return false;
    }

    public PaginatedResponse<UserDTO> getConnections(String cursor, Authentication authentication) {
        int page = (cursor != null && !cursor.isEmpty()) ? Integer.parseInt(cursor) : 0;
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Page<Connection> connections = connectionRepository.findAllByUser(currentUser, PageRequest.of(page, PAGE_SIZE));

        List<UserDTO> dtos = connections.getContent().stream()
                .map(c -> {
                    Userr other = c.getRequester().getId() == currentUser.getId()
                            ? c.getAddressee() : c.getRequester();
                    return toUserDTO(other, currentUser);
                })
                .collect(Collectors.toList());

        boolean hasMore = page < connections.getTotalPages() - 1;
        String nextCursor = hasMore ? String.valueOf(page + 1) : null;

        return new PaginatedResponse<>(dtos, nextCursor, hasMore);
    }

    public UserDTO getUserById(Long userId, Authentication authentication) {
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Userr user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserDTO(user, currentUser);
    }

    private UserDTO toUserDTO(Userr user, Userr currentUser) {
        boolean isConnected = connectionRepository.existsConnectionBetween(currentUser, user);
        return new UserDTO(
                String.valueOf(user.getId()),
                user.getUsername(),
                user.getTitle() != null ? user.getTitle() : "",
                null,
                0,
                user.getBio(),
                isConnected
        );
    }
}
