package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.EditProfileRequest;
import com.fsdm.wisd.scienceMedia.dto.ProfileDetailResponse;
import com.fsdm.wisd.scienceMedia.entite.Image;
import com.fsdm.wisd.scienceMedia.entite.Userr;
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
        if(optUser.isPresent()){
            Userr user = optUser.get();
            if(editeProfileRequest.getProfileImage()!=null){
                Image profileImage = new Image();
                MultipartFile mpf = editeProfileRequest.getProfileImage();
                profileImage.setImageType(mpf.getContentType());
                profileImage.setImageData(mpf.getBytes());
                profileImage.setCreatedAt(LocalDateTime.now());
                profileImage.setUser(user);
//                imageRepository.save(profileImage);
                user.setProfileImage(profileImage);
            }
        }
    }
}
