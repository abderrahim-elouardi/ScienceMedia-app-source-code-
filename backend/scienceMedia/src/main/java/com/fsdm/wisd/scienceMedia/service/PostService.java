package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.*;
import com.fsdm.wisd.scienceMedia.entite.*;
import com.fsdm.wisd.scienceMedia.enums.PostType;
import com.fsdm.wisd.scienceMedia.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private static final int PAGE_SIZE = 10;

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, LikeRepository likeRepository,
                       BookmarkRepository bookmarkRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
    }

    public PaginatedResponse<PostDTO> getFeed(String cursor, Authentication authentication) {
        int page = (cursor != null && !cursor.isEmpty()) ? Integer.parseInt(cursor) : 0;
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Page<Post> postPage = postRepository.findAllByOrderByPublishedAtDesc(PageRequest.of(page, PAGE_SIZE));

        List<PostDTO> dtos = postPage.getContent().stream()
                .map(p -> toPostDTO(p, currentUser))
                .collect(Collectors.toList());

        boolean hasMore = page < postPage.getTotalPages() - 1;
        String nextCursor = hasMore ? String.valueOf(page + 1) : null;

        return new PaginatedResponse<>(dtos, nextCursor, hasMore);
    }

    @Transactional
    public PostDTO createPost(CreatePostRequest req, Authentication authentication) {
        Userr author = userRepository.findByEmail(authentication.getName()).orElseThrow();

        Post post = new Post();
        post.setAuthor(author);
        post.setType(PostType.valueOf(req.getType().toUpperCase()));
        post.setTitle(req.getTitle() != null ? req.getTitle() : "");
        post.setExcerpt(req.getExcerpt());
        post.setContent(req.getContent());
        post.setImageUrl(req.getImageUrl());
        post.setVideoUrl(req.getVideoUrl());
        post.setDocumentUrl(req.getDocumentUrl());
        post.setDocumentName(req.getDocumentName());
        post.setTags(req.getTags() != null ? req.getTags() : new ArrayList<>());
        post.setPublishedAt(LocalDateTime.now());

        if (req.getMeeting() != null) {
            MeetingDTO m = req.getMeeting();
            Meeting meeting = new Meeting();
            meeting.setTitle(m.getTitle());
            meeting.setDescription(m.getDescription());
            if (m.getStartDate() != null) meeting.setStartDate(LocalDateTime.parse(m.getStartDate()));
            if (m.getEndDate() != null) meeting.setEndDate(LocalDateTime.parse(m.getEndDate()));
            meeting.setMeetingUrl(m.getMeetingUrl());
            meeting.setParticipantsCount(m.getParticipantsCount());
            post.setMeeting(meeting);
        }

        Post saved = postRepository.save(post);

        Long postCount = author.getNumberOfPosts() != null ? author.getNumberOfPosts() + 1 : 1L;
        author.setNumberOfPosts(postCount);
        userRepository.save(author);

        return toPostDTO(saved, author);
    }

    public PostDTO getPostById(Long postId, Authentication authentication) {
        Userr currentUser = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return toPostDTO(post, currentUser);
    }

    @Transactional
    public int likePost(Long postId, Authentication authentication) {
        Userr user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!likeRepository.existsByUserAndPost(user, post)) {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);
        }
        return post.getLikesCount();
    }

    @Transactional
    public int unlikePost(Long postId, Authentication authentication) {
        Userr user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        likeRepository.findByUserAndPost(user, post).ifPresent(like -> {
            likeRepository.delete(like);
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
            postRepository.save(post);
        });
        return post.getLikesCount();
    }

    @Transactional
    public void bookmarkPost(Long postId, Authentication authentication) {
        Userr user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!bookmarkRepository.existsByUserAndPost(user, post)) {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setPost(post);
            bookmarkRepository.save(bookmark);
        }
    }

    @Transactional
    public int repostPost(Long postId, Authentication authentication) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setSharesCount(post.getSharesCount() + 1);
        postRepository.save(post);
        return post.getSharesCount();
    }

    PostDTO toPostDTO(Post post, Userr currentUser) {
        PostAuthorDTO author = new PostAuthorDTO(
                post.getAuthor().getUsername(),
                post.getAuthor().getTitle() != null ? post.getAuthor().getTitle() : "",
                null
        );

        MeetingDTO meetingDTO = null;
        if (post.getMeeting() != null) {
            Meeting m = post.getMeeting();
            meetingDTO = new MeetingDTO(
                    m.getTitle(),
                    m.getDescription(),
                    m.getStartDate() != null ? m.getStartDate().toString() : null,
                    m.getEndDate() != null ? m.getEndDate().toString() : null,
                    m.getMeetingUrl(),
                    m.getParticipantsCount()
            );
        }

        boolean isLiked = likeRepository.existsByUserAndPost(currentUser, post);
        boolean isBookmarked = bookmarkRepository.existsByUserAndPost(currentUser, post);

        return new PostDTO(
                String.valueOf(post.getId()),
                author,
                post.getType().name().toLowerCase(),
                post.getTitle(),
                post.getExcerpt(),
                post.getContent(),
                post.getImageUrl(),
                post.getVideoUrl(),
                post.getDocumentUrl(),
                post.getDocumentName(),
                meetingDTO,
                post.getLikesCount(),
                post.getCommentsCount(),
                post.getSharesCount(),
                isLiked,
                isBookmarked,
                post.getTags(),
                post.getPublishedAt().toString(),
                post.getReadTimeMinutes()
        );
    }
}
