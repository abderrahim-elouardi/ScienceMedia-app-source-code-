package com.fsdm.wisd.scienceMedia.controller;

import com.fsdm.wisd.scienceMedia.dto.*;
import com.fsdm.wisd.scienceMedia.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/feed")
    public ResponseEntity<PaginatedResponse<PostDTO>> getFeed(
            @RequestParam(required = false) String cursor,
            Authentication authentication) {
        return ResponseEntity.ok(postService.getFeed(cursor, authentication));
    }

    @PostMapping("/posts")
    public ResponseEntity<PostDTO> createPost(@RequestBody CreatePostRequest request,
                                              Authentication authentication) {
        return ResponseEntity.ok(postService.createPost(request, authentication));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id,
                                               Authentication authentication) {
        return ResponseEntity.ok(postService.getPostById(id, authentication));
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<Map<String, Integer>> likePost(@PathVariable Long id,
                                                         Authentication authentication) {
        int count = postService.likePost(id, authentication);
        return ResponseEntity.ok(Map.of("likesCount", count));
    }

    @DeleteMapping("/posts/{id}/like")
    public ResponseEntity<Map<String, Integer>> unlikePost(@PathVariable Long id,
                                                           Authentication authentication) {
        int count = postService.unlikePost(id, authentication);
        return ResponseEntity.ok(Map.of("likesCount", count));
    }

    @PostMapping("/posts/{id}/bookmark")
    public ResponseEntity<Void> bookmarkPost(@PathVariable Long id,
                                             Authentication authentication) {
        postService.bookmarkPost(id, authentication);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/posts/{id}/repost")
    public ResponseEntity<Map<String, Integer>> repostPost(@PathVariable Long id,
                                                           Authentication authentication) {
        int count = postService.repostPost(id, authentication);
        return ResponseEntity.ok(Map.of("sharesCount", count));
    }
}
