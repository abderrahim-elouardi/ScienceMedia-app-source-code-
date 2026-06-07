package com.fsdm.wisd.scienceMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private String id;
    private PostAuthorDTO author;
    private String type;
    private String title;
    private String excerpt;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private String documentUrl;
    private String documentName;
    private MeetingDTO meeting;
    private int likesCount;
    private int commentsCount;
    private int sharesCount;
    private boolean isLiked;
    private boolean isBookmarked;
    private List<String> tags;
    private String publishedAt;
    private Integer readTimeMinutes;
}
