package com.fsdm.wisd.scienceMedia.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {
    private String type;
    private String title;
    private String excerpt;
    private String content;
    private List<String> tags;
    private String imageUrl;
    private String videoUrl;
    private String documentUrl;
    private String documentName;
    private MeetingDTO meeting;
}
