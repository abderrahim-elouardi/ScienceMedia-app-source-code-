package com.fsdm.wisd.scienceMedia.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EditProfileRequest {
    private MultipartFile profileImage;
    private String username;
    private String title;
    private String bio;
}
