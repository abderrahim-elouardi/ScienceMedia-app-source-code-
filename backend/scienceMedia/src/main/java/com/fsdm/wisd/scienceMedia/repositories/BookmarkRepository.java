package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Bookmark;
import com.fsdm.wisd.scienceMedia.entite.Post;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    Optional<Bookmark> findByUserAndPost(Userr user, Post post);

    boolean existsByUserAndPost(Userr user, Post post);

    Page<Bookmark> findByUserOrderBySavedAtDesc(Userr user, Pageable pageable);
}
