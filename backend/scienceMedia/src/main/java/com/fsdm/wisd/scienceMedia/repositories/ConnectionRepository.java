package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Connection;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    Optional<Connection> findByRequesterAndAddressee(Userr requester, Userr addressee);

    @Query("SELECT c FROM Connection c WHERE c.requester = :user OR c.addressee = :user")
    Page<Connection> findAllByUser(@Param("user") Userr user, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Connection c " +
           "WHERE (c.requester = :u1 AND c.addressee = :u2) OR (c.requester = :u2 AND c.addressee = :u1)")
    boolean existsConnectionBetween(@Param("u1") Userr u1, @Param("u2") Userr u2);

    @Query("SELECT COUNT(c) FROM Connection c WHERE c.requester = :user OR c.addressee = :user")
    long countByUser(@Param("user") Userr user);
}
