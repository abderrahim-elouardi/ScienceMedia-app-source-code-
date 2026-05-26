package com.fsdm.wisd.scienceMedia.service;

import com.fsdm.wisd.scienceMedia.dto.AuthResponse;
import com.fsdm.wisd.scienceMedia.dto.RegisterRequest;
import com.fsdm.wisd.scienceMedia.entite.Userr;
import com.fsdm.wisd.scienceMedia.enums.Role;
import com.fsdm.wisd.scienceMedia.mapper.RegisterDtoMapper;
import com.fsdm.wisd.scienceMedia.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final JwtEncoder jwtEncoder;
    private JwtDecoder jwtDecoder;
    private final AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private SendEmailService sendEmailService;

    @Value("${jwt.timeExpairation}")
    private int timeExpairation;

    public AuthenticationService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder, AuthenticationManager authenticationManager, UserRepository userRepository , PasswordEncoder passwordEncoder, SendEmailService sendEmailService) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
        this.authenticationManager = authenticationManager;
        this.userRepository=userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sendEmailService = sendEmailService;
    }

    public ResponseEntity<AuthResponse> login(String username, String password) {
        System.out.println("------------- service authentication ------------");
        Authentication authentication=null;
        String subject=null;
        String scope=null;
        AuthResponse response = new AuthResponse();
        authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
        subject=authentication.getName();
        scope=authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));
        Instant instant=Instant.now();
        Userr user=userRepository.findByEmail(subject).get();
        System.out.println("------------------");
        System.out.println(user);
        System.out.println("-------------------");
        JwtClaimsSet jwtClaimSet= JwtClaimsSet.builder()
                .subject(subject)
                .issuedAt(instant)
                .expiresAt(instant.plus(timeExpairation, ChronoUnit.MINUTES))
                .claim("scope",scope)
                .build();

        JwtEncoderParameters jwtEncoderParameters=JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS512).build(),
                jwtClaimSet
        );

        Jwt jwt=jwtEncoder.encode(jwtEncoderParameters);
        String jwtString=jwt.getTokenValue();

        response.setAcces_token(jwtString);
        response.setUser(user);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Transactional
    public HttpStatus resetPassword(Authentication authentication, String newPassword) {
        Userr user = userRepository.findByEmail(authentication.getName()).orElseThrow(()->new RuntimeException("user not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        System.out.println(user);
        return HttpStatus.OK;
    }

    @Transactional
    public boolean register(RegisterRequest profile) {
        try{
            Userr user = RegisterDtoMapper.fromRegisterRequestToUser(profile);
            user.setRole(Role.USER);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }


    }

    public HttpStatus resetPasswordWithEmail(String email) {
        String content = """
                Bonjour %s,
                
                Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Science Media.
                
                Voici votre code de validation à usage unique :
                
                [%d]
                Ce code est valide pendant 15 minutes. Ne le partagez jamais avec personne.
                """;
        Optional<Userr> optUser = userRepository.findByEmail(email);
        if(optUser.isPresent()){
            Userr user = optUser.get();
            int resetNumber = ThreadLocalRandom.current().nextInt(10000, 100000);
            content = content.formatted(user.getUsername(), resetNumber);
            try{
//                sendEmailService.sendEmail(email,"Votre code de réinitialisation de mot de passe - Science Media",content);
            } catch (RuntimeException e) {
                return HttpStatus.INTERNAL_SERVER_ERROR;
            }
            return HttpStatus.OK;
        }
        return HttpStatus.UNAUTHORIZED;
    }
}
