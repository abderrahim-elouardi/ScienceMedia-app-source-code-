package com.fsdm.wisd.scienceMedia;

import com.fsdm.wisd.scienceMedia.entite.Image;
import com.fsdm.wisd.scienceMedia.entite.Post;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.repositories.ImageRepository;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class ScienceMediaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScienceMediaApplication.class, args);
	}


	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	ImageRepository imageRepository;
	@Bean
	public CommandLineRunner initDatabase(UserRepository repository, UserRepository userRepository) {
		return args -> {
			// Votre logique d'initialisation ici
			System.out.println("--- Initialisation de la base H2 ---");
			Userr user1 = new Userr();
			user1.setUsername("elouardi");
			user1.setEmail("elouardi@gmail.com");
			user1.setPassword(passwordEncoder.encode("abdo123"));
			user1.setBio("hamdolilah");
			user1.setTitle("data scientist");
			user1.setNumberOfFollowers(0L);
			user1.setNumberOfFollowing(0L);

			user1.setProfileImage(null);
			repository.save(user1);
			Userr user2 = new Userr();
			user2.setUsername("elouardi");
			user2.setEmail("elouardiabderrahim06@gmail.com");
			user2.setPassword(passwordEncoder.encode("abdo123"));
			user2.setBio("hamdolilah");
			user2.setTitle("data scientist");
			user2.setProfileImage(null);
			repository.save(user2);
			List<Userr> f = user1.getFollowers();
			f.add(user2);
			user1.setFollowers(f);
			user1.setNumberOfFollowers(user1.getNumberOfFollowers()+1);
			user1.setNumberOfFollowing(user1.getNumberOfFollowing()+100);
			user1.setNumberOfPosts(10L);
//			System.out.println(user1.getFollowers().size());

//adding profile image
			File fichier = new File("C:\\Users\\HP\\Pictures\\Screenshots\\Screenshot 2026-05-26 141959.png");

			// 1. Détecter le format/type de l'image à partir de l'extension (ex: png, jpg)
			String nomFichier = fichier.getName();
			String extension = nomFichier.substring(nomFichier.lastIndexOf(".") + 1).toLowerCase();

			// 2. Lire l'image avec ImageIO
			BufferedImage bufferedImage = ImageIO.read(fichier);
			if (bufferedImage == null) {
				throw new IOException("Le fichier n'est pas une image valide ou le format n'est pas supporté.");
			}

			// 3. Convertir la BufferedImage en tableau d'octets (byte[])
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			// Écrit les données de l'image dans le flux au format spécifié (png, jpg, etc.)
			ImageIO.write(bufferedImage, extension, baos);
			byte[] bytes = baos.toByteArray();

			// 4. Créer et remplir ton entité JPA
			Image nouvelleImage = new Image();
			nouvelleImage.setImageData(bytes);                          // Stocke le BLOB (@Lob)
			nouvelleImage.setImageType("image/" + extension);           // ex: "image/png" ou "image/jpeg"
			nouvelleImage.setContent("Image chargée depuis : " + nomFichier);
			nouvelleImage.setCreatedAt(LocalDateTime.now());
			user1.setProfileImage(nouvelleImage);
			nouvelleImage.setUser(user1);
//			Post post = new Post();
//			post.setAuthor(user1);
//			post.setContent("that's me");
//			post.setTitle("happy aid");
//			post.set
			imageRepository.save(nouvelleImage);
			repository.save(user1);


			System.out.println("--- Données insérées avec succès ! ---");
		};
	}

}
