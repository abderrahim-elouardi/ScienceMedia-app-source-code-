package com.fsdm.wisd.scienceMedia.dto;

import com.fsdm.wisd.scienceMedia.entite.Image;
import com.fsdm.wisd.scienceMedia.entite.Post;
import lombok.Data;

import java.util.List;

@Data
public class ProfileDetailResponse {
    private Long numberOfFollowers;
    private Long numberOfFollowing;
    private Long numberOfPosts;
    private Image profileImage;
    private List<Post> posts;
}
