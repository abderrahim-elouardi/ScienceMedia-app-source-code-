package com.fsdm.wisd.scienceMedia.controller.auth;


import com.fsdm.wisd.scienceMedia.dto.AuthResponse;
import com.fsdm.wisd.scienceMedia.dto.EditProfileRequest;
import com.fsdm.wisd.scienceMedia.dto.ProfileDetailResponse;
import com.fsdm.wisd.scienceMedia.dto.RegisterRequest;
import com.fsdm.wisd.scienceMedia.entite.Image;
import com.fsdm.wisd.scienceMedia.service.AuthenticationService;
import com.fsdm.wisd.scienceMedia.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController()
@RequestMapping("/profile")
public class Profile {
    private AuthenticationService authenticationService;
    private ProfileService profileService;


    public Profile(AuthenticationService authenticationService,ProfileService profileService) {
        this.authenticationService = authenticationService;
        this.profileService = profileService;
    }

    @PutMapping("/change-password")
    public HttpStatus resetPassword(Authentication authentication, @RequestParam String newPassword){
        return authenticationService.resetPassword(authentication , newPassword);
    }
    @PutMapping("/change-password-with-email")
    public HttpStatus resetPasswordWithEmail(@RequestParam String email){
        return authenticationService.resetPasswordWithEmail(email);
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest profile){
        if (authenticationService.register(profile)){
            System.out.println(profile);
            return authenticationService.login(profile.getEmail() , profile.getPassword());
        }
        return null;
    }

    @PutMapping("/profile_image/change")
    public HttpStatus uploadImage(@RequestParam("file") MultipartFile file, Authentication authentication) {
        return profileService.changeProfileImage(file,authentication);
    }

    @GetMapping("/number_followers")
    public Long getNumberOfFollowers(Authentication authentication){
        return profileService.getNumberOfFollowers(authentication);
    }


    @GetMapping("/profile_details")
    public ProfileDetailResponse getProfileDetails(Authentication authentication){
        return profileService.getProfileDetails(authentication);
    }

    @PutMapping("editProfile")
    public HttpStatus editeProfile(@RequestBody EditProfileRequest editeProfileRequest,Authentication authentication) throws IOException {
        return profileService.editeProfile(editeProfileRequest,authentication);
    }

}
