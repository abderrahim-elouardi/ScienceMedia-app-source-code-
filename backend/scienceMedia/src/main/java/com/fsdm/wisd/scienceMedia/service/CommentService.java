package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.CommentDTO;
import com.fsdm.wisd.scienceMedia.dto.CreateCommentRequest;
import com.fsdm.wisd.scienceMedia.entite.Comment;
import com.fsdm.wisd.scienceMedia.entite.Post;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.repositories.CommentRepository;
import com.fsdm.wisd.scienceMedia.repositories.PostRepository;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private static final int PAGE_SIZE = 50;

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<CommentDTO> getComments(Long postId, Authentication authentication) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Page<Comment> comments = commentRepository.findByPostOrderByCreatedAtDesc(post, PageRequest.of(0, PAGE_SIZE));
        return comments.getContent().stream()
                .map(this::toCommentDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDTO addComment(Long postId, CreateCommentRequest request, Authentication authentication) {
        Userr author = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setAuthor(author);
        comment.setPost(post);
        comment.setContent(request.getContent());
        Comment saved = commentRepository.save(comment);

        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);

        return toCommentDTO(saved);
    }

    private CommentDTO toCommentDTO(Comment comment) {
        Userr author = comment.getAuthor();
        return new CommentDTO(
                String.valueOf(comment.getId()),
                author.getUsername(),
                author.getTitle() != null ? author.getTitle() : "",
                null,
                comment.getContent(),
                comment.getCreatedAt().toString(),
                0
        );
    }
}
