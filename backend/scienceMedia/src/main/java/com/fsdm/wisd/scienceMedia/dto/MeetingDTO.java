package com.fsdm.wisd.scienceMedia.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MeetingDTO {
    private String title;
    private String description;
    private String startDate;
    private String endDate;
    private String meetingUrl;
    private Integer participantsCount;
}
