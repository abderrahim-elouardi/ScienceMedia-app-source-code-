package com.fsdm.wisd.scienceMedia.dto;

import com.fsdm.wisd.scienceMedia.entite.Image;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EditProfileRequest {
    private ImageDTO newProfileImage;
    private String username;
    private String title;
    private String bio;
}
