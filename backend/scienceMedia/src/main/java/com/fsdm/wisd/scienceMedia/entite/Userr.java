package com.fsdm.wisd.scienceMedia.entite;

import com.fsdm.wisd.scienceMedia.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data

public class Userr {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private long id;
    private String username;

    @Column(unique = true)
    private String email;
    private String password;
    private String bio;
    private String title;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Image profileImage;

    private Role role;

    private Long numberOfFollowers;
    private Long numberOfFollowing;
    private Long numberOfPosts;


    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_relations",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private List<Userr> following = new ArrayList<Userr>();

    @ManyToMany(mappedBy = "following")
    private List<Userr> followers = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();
}
