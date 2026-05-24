package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Like;
import com.fsdm.wisd.scienceMedia.entite.Post;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndPost(Userr user, Post post);

    boolean existsByUserAndPost(Userr user, Post post);

    long countByPost(Post post);
}
