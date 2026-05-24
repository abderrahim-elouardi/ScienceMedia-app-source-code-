package com.fsdm.wisd.scienceMedia.entite;

import com.fsdm.wisd.scienceMedia.enums.PostType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Userr author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;

    @Column(nullable = false)
    private String title;

    private String excerpt;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String imageUrl;
    private String videoUrl;
    private String documentUrl;
    private String documentName;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    private int likesCount = 0;
    private int commentsCount = 0;
    private int sharesCount = 0;

    private Integer readTimeMinutes;

    private LocalDateTime publishedAt = LocalDateTime.now();
}
