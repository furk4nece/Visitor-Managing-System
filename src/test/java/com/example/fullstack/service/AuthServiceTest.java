package com.example.fullstack.service;

import com.example.fullstack.entity.User;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.security.UnauthorizedException;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.InjectMock;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@QuarkusTest
public class AuthServiceTest {

    @Inject
    AuthService authService;

    @InjectMock
    UserService userService;

    @Test
    void loginWithUnknownUsernameThrowsUnauthorized() {
        when(userService.findByUsername("hayaletkullanici"))
                .thenReturn(Uni.createFrom().nullItem());

        assertThrows(UnauthorizedException.class,
                () -> authService.login("hayaletkullanici", "herhangibirsifre").await().indefinitely());
    }

    @Test
    void loginWithWrongPasswordThrowsUnauthorized() {
        User user = new User();
        user.username = "furkan";
        user.role = "ADMIN";
        user.setPassword(BcryptUtil.bcryptHash("dogrusifre123"));

        when(userService.findByUsername("furkan"))
                .thenReturn(Uni.createFrom().item(user));

        assertThrows(UnauthorizedException.class,
                () -> authService.login("furkan", "yanlissifre").await().indefinitely());
    }

    @Test
    void loginWithCorrectCredentialsReturnsToken() {
        User user = new User();
        user.username = "furkan";
        user.role = "ADMIN";
        user.setPassword(BcryptUtil.bcryptHash("dogrusifre123"));

        when(userService.findByUsername("furkan"))
                .thenReturn(Uni.createFrom().item(user));

        String token = authService.login("furkan", "dogrusifre123").await().indefinitely();

        assertNotNull(token);
    }
}