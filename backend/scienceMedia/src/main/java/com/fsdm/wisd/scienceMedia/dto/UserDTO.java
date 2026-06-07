package com.fsdm.wisd.scienceMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String displayName;
    private String specialty;
    private String avatarUrl;
    private Integer mutualConnections;
    private String bio;
    private Boolean isConnected;
}
