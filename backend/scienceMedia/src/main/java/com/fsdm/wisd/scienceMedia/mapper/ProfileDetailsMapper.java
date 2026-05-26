package com.fsdm.wisd.scienceMedia.mapper;

import com.fsdm.wisd.scienceMedia.dto.ProfileDetailResponse;
import com.fsdm.wisd.scienceMedia.entite.Userr;

public class ProfileDetailsMapper {
    public static ProfileDetailResponse toProfileDetailResponse(Userr user){
        ProfileDetailResponse profileDetailResponse = new ProfileDetailResponse();
        profileDetailResponse.setProfileImage(user.getProfileImage());
        profileDetailResponse.setNumberOfFollowers(user.getNumberOfFollowers());
        profileDetailResponse.setNumberOfFollowing(user.getNumberOfFollowing());
        profileDetailResponse.setNumberOfPosts(user.getNumberOfPosts());
        profileDetailResponse.setPosts(user.getPosts());
        return profileDetailResponse;
    }
}
