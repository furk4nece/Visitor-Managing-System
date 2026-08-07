package com.example.fullstack.service;

import com.example.fullstack.entity.User;
import com.example.fullstack.dto.user.UpdateProfileRequest;
import jakarta.ws.rs.BadRequestException;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import org.hibernate.ObjectNotFoundException;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class UserService {

    @Inject
    SecurityIdentity securityIdentity;

    @WithSession
    public Uni<List<User>> list() {
        return User.listAll();
    }

    @WithSession
    public Uni<User> findById(Long id) {
        return User.<User>findById(id)
                .onItem().ifNull().failWith(() ->
                        new ObjectNotFoundException(id, "User"));
    }

    @WithSession
    public Uni<User> findByUsername(String username) {
        return User.find("username", username).firstResult();
    }

    @WithTransaction
    public Uni<User> create(User user) {
        user.setPassword(BcryptUtil.bcryptHash(user.getPassword()));
        return user.persistAndFlush();
    }

    @WithTransaction
    public Uni<User> update(Long id, User user) {
        return findById(id)
                .chain(existing -> {
                    // Sadece username ve role güncelleniyor
                    // Şifre bu metotla değiştirilemiyor (güvenlik)
                    existing.username = user.username;
                    existing.role = user.role;
                    return existing.persistAndFlush();
                });
    }

    @WithTransaction
    public Uni<Void> delete(Long id) {
        return findById(id)
                .chain(u -> u.delete());
    }

    @WithSession
    public Uni<User> getCurrentUser() {
        String username = securityIdentity.getPrincipal().getName();
        return User.find("username", username).firstResult();
    }

    @WithTransaction
    public Uni<User> updateCurrentUser(UpdateProfileRequest request) {

        String username = securityIdentity.getPrincipal().getName();

        return User.<User>find("username", username)
                .firstResult()
                .onItem().ifNull().failWith(() ->
                        new BadRequestException("Kullanıcı bulunamadı"))
                .chain(user -> {
                    user.fullName = request.fullName();
                    user.username = request.username();

                    if (request.newPassword() != null &&
                            !request.newPassword().isBlank()) {
                        if (request.currentPassword() == null ||
                                !BcryptUtil.matches(
                                        request.currentPassword(),
                                        user.getPassword())) {
                            throw new BadRequestException("Mevcut şifre hatalı.");
                        }
                        if (!request.newPassword()
                                .equals(request.confirmPassword())) {

                            throw new BadRequestException("Yeni şifreler uyuşmuyor.");
                        }
                        user.setPassword(
                                BcryptUtil.bcryptHash(request.newPassword()));
                    }
                    return user.persistAndFlush();
                });

    }
}