package com.fsdm.wisd.scienceMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostAuthorDTO {
    private String displayName;
    private String specialty;
    private String avatarUrl;
}
