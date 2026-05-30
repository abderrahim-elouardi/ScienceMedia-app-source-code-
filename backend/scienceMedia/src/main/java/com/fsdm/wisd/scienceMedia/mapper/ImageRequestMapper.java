package com.fsdm.wisd.scienceMedia.mapper;

import com.fsdm.wisd.scienceMedia.dto.ImageDTO;
import com.fsdm.wisd.scienceMedia.entite.Image;

import java.time.LocalDateTime;

public class ImageRequestMapper {
    public static Image toImage(ImageDTO imageDTO){
        Image image = new Image();
        image.setImageData(imageDTO.getImageData().getBytes());
        image.setImageType(imageDTO.getImageType());
        image.setContent(imageDTO.getContent());
        image.setCreatedAt(LocalDateTime.now());
        return image;
    }
}
