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

        boolean isSuperAdmin = securityIdentity
                .hasRole("SUPER_ADMIN");

        if (!isSuperAdmin && "ADMIN".equals(user.role)) {
            return Uni.createFrom()
                    .failure(new BadRequestException(
                            "ADMIN kullanıcısı oluşturma yetkiniz yok."));
        }

        if (!isSuperAdmin && "SUPER_ADMIN".equals(user.role)) {
            return Uni.createFrom()
                    .failure(new BadRequestException(
                            "SUPER_ADMIN kullanıcısı oluşturma yetkiniz yok."));
        }

        user.setPassword(BcryptUtil.bcryptHash(user.getPassword()));

        return user.persistAndFlush();
    }

    @WithTransaction
    public Uni<User> update(Long id, User user) {

        boolean isSuperAdmin = securityIdentity
                .hasRole("SUPER_ADMIN");

        return findById(id)
                .chain(existing -> {
                    if (!isSuperAdmin) {
                        if (!"RECEPTIONIST".equals(existing.role)) {
                            return Uni.createFrom().failure(new BadRequestException(
                                    "Bu kullanıcıyı düzenleme yetkiniz yok."));
                        }
                        if ("SUPER_ADMIN".equals(user.role)) {
                            return Uni.createFrom().failure(new BadRequestException(
                                    "Bu role atama yetkiniz yok."));
                        }
                    }
                    existing.username = user.username;
                    existing.role = user.role;
                    return existing.persistAndFlush();
                });
    }

    @WithTransaction
    public Uni<Void> delete(Long id) {

        String currentUsername = securityIdentity
                .getPrincipal()
                .getName();

        boolean isSuperAdmin = securityIdentity
                .hasRole("SUPER_ADMIN");

        return findById(id)
                .chain(user -> {

                    if (user.username.equals(currentUsername)) {
                        return Uni.createFrom()
                                .failure(new BadRequestException(
                                        "Kendi hesabınızı silemezsiniz."));
                    }

                    if (isSuperAdmin) {
                        return user.delete();
                    }

                    if ("ADMIN".equals(user.role)) {
                        return Uni.createFrom()
                                .failure(new BadRequestException(
                                        "Başka bir ADMIN kullanıcısını silemezsiniz."));
                    }

                    if ("SUPER_ADMIN".equals(user.role)) {
                        return Uni.createFrom()
                                .failure(new BadRequestException(
                                        "SUPER_ADMIN kullanıcısını silemezsiniz."));
                    }

                    return user.delete();
                });
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