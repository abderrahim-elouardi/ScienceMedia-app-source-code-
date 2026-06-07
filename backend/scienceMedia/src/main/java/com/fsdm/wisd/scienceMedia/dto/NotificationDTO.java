package com.fsdm.wisd.scienceMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDTO {
    private String id;
    private String name;
    private String action;
    private String time;
    private boolean read;
    private String avatar;
    private String iconColor;
    private String icon;
}
