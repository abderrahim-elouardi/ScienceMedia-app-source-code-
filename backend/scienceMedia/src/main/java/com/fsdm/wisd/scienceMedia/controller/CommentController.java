package com.fsdm.wisd.scienceMedia.controller;

import com.fsdm.wisd.scienceMedia.dto.CommentDTO;
import com.fsdm.wisd.scienceMedia.dto.CreateCommentRequest;
import com.fsdm.wisd.scienceMedia.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long postId,
                                                         Authentication authentication) {
        return ResponseEntity.ok(commentService.getComments(postId, authentication));
    }

    @PostMapping
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long postId,
                                                 @RequestBody CreateCommentRequest request,
                                                 Authentication authentication) {
        return ResponseEntity.ok(commentService.addComment(postId, request, authentication));
    }
}
