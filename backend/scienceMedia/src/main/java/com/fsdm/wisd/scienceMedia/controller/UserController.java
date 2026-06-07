package com.fsdm.wisd.scienceMedia.controller;

import com.fsdm.wisd.scienceMedia.dto.PaginatedResponse;
import com.fsdm.wisd.scienceMedia.dto.UserDTO;
import com.fsdm.wisd.scienceMedia.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<PaginatedResponse<UserDTO>> getSuggestions(
            @RequestParam(required = false) String cursor,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getSuggestions(cursor, authentication));
    }

    @GetMapping("/connections")
    public ResponseEntity<PaginatedResponse<UserDTO>> getConnections(
            @RequestParam(required = false) String cursor,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getConnections(cursor, authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id,
                                               Authentication authentication) {
        return ResponseEntity.ok(userService.getUserById(id, authentication));
    }

    @PostMapping("/{id}/connect")
    public ResponseEntity<Map<String, Boolean>> connectUser(@PathVariable Long id,
                                                            Authentication authentication) {
        boolean isConnected = userService.connectUser(id, authentication);
        return ResponseEntity.ok(Map.of("isConnected", isConnected));
    }

    @DeleteMapping("/{id}/connect")
    public ResponseEntity<Map<String, Boolean>> disconnectUser(@PathVariable Long id,
                                                               Authentication authentication) {
        boolean isConnected = userService.disconnectUser(id, authentication);
        return ResponseEntity.ok(Map.of("isConnected", isConnected));
    }
}
