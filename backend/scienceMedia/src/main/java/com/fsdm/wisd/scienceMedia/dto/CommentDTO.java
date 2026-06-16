package com.fsdm.wisd.scienceMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private String id;
    private String authorName;
    private String authorSpecialty;
    private String avatarUrl;
    private String text;
    private String createdAt;
    private int likesCount;
}
