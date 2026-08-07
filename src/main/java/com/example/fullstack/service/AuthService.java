package com.example.fullstack.service;

import com.example.fullstack.entity.User;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.jwt.build.Jwt;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import io.quarkus.security.UnauthorizedException;

import java.time.Duration;
import java.util.Set;

@ApplicationScoped
public class AuthService {

    private final UserService userService;

    @Inject
    public AuthService(UserService userService) {
        this.userService = userService;
    }

    public Uni<String> login(String username, String password) {
        return userService.findByUsername(username)
                .onItem().ifNull().failWith(() ->
                        new UnauthorizedException("Kullanici adi veya sifre yanlis."))
                .chain(user -> {
                    if (!BcryptUtil.matches(password, user.getPassword())) {
                        throw new UnauthorizedException("Kullanici adi veya sifre yanlis.");
                    }
                    String token = generateToken(user);
                    return Uni.createFrom().item(token);
                });
    }

    private String generateToken(User user) {
        return Jwt
                .issuer("https://vms.example.com")
                .upn(user.username)
                .groups(Set.of(user.role))
                .expiresIn(Duration.ofHours(24))
                .sign();
    }
}