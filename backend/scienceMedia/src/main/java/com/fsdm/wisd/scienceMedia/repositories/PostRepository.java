package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Post;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.enums.PostType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByOrderByPublishedAtDesc(Pageable pageable);

    Page<Post> findByAuthorOrderByPublishedAtDesc(Userr author, Pageable pageable);

    Page<Post> findByTypeOrderByPublishedAtDesc(PostType type, Pageable pageable);

    List<Post> findByTagsContaining(String tag);
}
