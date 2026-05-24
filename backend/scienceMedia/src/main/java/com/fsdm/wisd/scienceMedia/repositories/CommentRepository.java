package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Comment;
import com.fsdm.wisd.scienceMedia.entite.Post;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);

    long countByPost(Post post);

    void deleteByAuthorAndPost(Userr author, Post post);
}
