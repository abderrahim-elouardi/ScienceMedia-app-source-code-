package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.EditProfileRequest;
import com.fsdm.wisd.scienceMedia.dto.ProfileDetailResponse;
import com.fsdm.wisd.scienceMedia.entite.Image;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.mapper.ImageRequestMapper;
import com.fsdm.wisd.scienceMedia.mapper.ProfileDetailsMapper;
import com.fsdm.wisd.scienceMedia.repositories.ImageRepository;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProfileService {
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;

    public ProfileService(UserRepository userRepository , ImageRepository imageRepository) {
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
    }

    public HttpStatus changeProfileImage(MultipartFile file, Authentication authentication){
        try{
            Image image = new Image();
            image.setImageData(file.getBytes());
            Userr user=userRepository.findByEmail(authentication.getName()).get();
            user.setProfileImage(image);
            imageRepository.save(image);
            return HttpStatus.OK;
        } catch (Exception e) {
            return HttpStatus.BAD_REQUEST;
        }


    }

    public Long getNumberOfFollowers(Authentication authentication) {
        Optional<Userr> optUser =userRepository.findByEmail(authentication.getName());
        if(optUser.isPresent()){
            Userr user= optUser.get();
            return user.getNumberOfFollowers();
        }
        return null;
    }
//
//    public Long getNumberOfFollowing(Authentication authentication) {
//        Optional<Userr> optUser =userRepository.findByEmail(authentication.getName());
//        if(optUser.isPresent()){
//            Userr user= optUser.get();
//            return user.getNumberOfFollowing();
//        }
//        return null;
//    }
//
//    public Long getNumberOfPosts(Authentication authentication) {
//        return userRepository.findByEmail(authentication.getName()).get().getNumberOfPosts();
//    }
//
//    public Image getProfileImage(Authentication authentication) {
//        Userr user = userRepository.findByEmail(authentication.getName()).get();
//        return imageRepository.findImageByUser(user).get();
//    }

    public ProfileDetailResponse getProfileDetails(Authentication authentication) {
        Optional<Userr> optUser = userRepository.findByEmail(authentication.getName());
        return optUser.map(ProfileDetailsMapper::toProfileDetailResponse).orElse(null);
    }

    @Transactional
    public HttpStatus editeProfile(EditProfileRequest editeProfileRequest, Authentication authentication) throws IOException {
        Optional<Userr> optUser = userRepository.findByEmail(authentication.getName());
        System.out.println("user found "+ optUser);
        if(optUser.isPresent()){
            Userr user = optUser.get();
            Optional<Image> optImage = imageRepository.findImageByUser(user);
            if (optImage.isPresent()){
                System.out.println("adding image for the first time");
                Image image = optImage.get();
                Image newImage = ImageRequestMapper.toImage(editeProfileRequest.getNewProfileImage());
                image.setImageData(newImage.getImageData());
                image.setImageType(newImage.getImageType());
                image.setContent(newImage.getContent());
                image.setCreatedAt(LocalDateTime.now());
                user.setBio(editeProfileRequest.getBio());
                user.setTitle(editeProfileRequest.getTitle());
                user.setUsername(editeProfileRequest.getUsername());
                userRepository.save(user);
                System.out.println("user saved "+ user);
                return HttpStatus.OK;
            }
            else {
                System.out.println("editing a existing image");
                Image newImage = ImageRequestMapper.toImage(editeProfileRequest.getNewProfileImage());
                System.out.println(newImage.getImageData());
                newImage.setUser(user);
                newImage.setCreatedAt(LocalDateTime.now());
                user.setProfileImage(newImage);
                user.setBio(editeProfileRequest.getBio());
                user.setTitle(editeProfileRequest.getTitle());
                user.setUsername(editeProfileRequest.getUsername());
                userRepository.save(user);
                System.out.println("user saved " + user);
                return HttpStatus.OK;
            }
        }
        return HttpStatus.BAD_REQUEST;
    }
}
