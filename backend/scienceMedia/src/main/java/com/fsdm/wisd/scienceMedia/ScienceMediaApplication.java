package com.fsdm.wisd.scienceMedia;

import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ScienceMediaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScienceMediaApplication.class, args);
	}


	@Autowired
	private PasswordEncoder passwordEncoder;
	@Bean
	public CommandLineRunner initDatabase(UserRepository repository) {
		return args -> {
			// Votre logique d'initialisation ici
			System.out.println("--- Initialisation de la base H2 ---");
			Userr user1 = new Userr();
			user1.setUsername("elouardi");
			user1.setEmail("elouardi@gmail.com");
			user1.setPassword(passwordEncoder.encode("abdo123"));
			user1.setBio("hamdolilah");
			user1.setTitle("data scientist");
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

			System.out.println("--- Données insérées avec succès ! ---");
		};
	}

}
