package com.fsdm.wisd.scienceMedia.mapper;

import com.fsdm.wisd.scienceMedia.dto.ImageDTO;
import com.fsdm.wisd.scienceMedia.entite.Image;

import java.time.LocalDateTime;
import java.util.Base64;

public class ImageRequestMapper {
    public static Image toImage(ImageDTO imageDTO){
        Image image = new Image();
        image.setImageData(Base64.getDecoder().decode(imageDTO.getImageData()));
        image.setImageType(imageDTO.getImageType());
        image.setContent(imageDTO.getContent());
        image.setCreatedAt(LocalDateTime.now());
        return image;
    }
}
