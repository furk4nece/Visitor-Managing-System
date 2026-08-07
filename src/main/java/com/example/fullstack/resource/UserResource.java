package com.example.fullstack.resource;

import com.example.fullstack.dto.user.UserCreateRequest;
import com.example.fullstack.dto.user.UserResponse;
import com.example.fullstack.dto.user.UserUpdateRequest;
import com.example.fullstack.entity.User;
import com.example.fullstack.service.UserService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.example.fullstack.dto.user.UpdateProfileRequest;

import java.util.List;

@Path("/api/v1/users")
@RolesAllowed("ADMIN")
public class UserResource {

    private final UserService userService;

    @Inject
    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @GET
    public Uni<List<UserResponse>> get() {
        return userService.list()
                .map(list -> list.stream().map(UserResource::toResponse).toList());
    }

    @GET
    @Path("{id}")
    public Uni<UserResponse> get(@PathParam("id") Long id) {
        return userService.findById(id).map(UserResource::toResponse);
    }

    @GET
    @Path("me")
    @RolesAllowed({"ADMIN", "RECEPTIONIST"})
    public Uni<UserResponse> me() {
        return userService.getCurrentUser().map(UserResource::toResponse);
    }

    @PUT
    @Path("me")
    @RolesAllowed({"ADMIN", "RECEPTIONIST"})
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<UserResponse> updateMyProfile(
            @Valid UpdateProfileRequest request) {

        return userService
                .updateCurrentUser(request)
                .map(UserResource::toResponse);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<Response> create(@Valid UserCreateRequest request) {
        User user = new User();
        user.username = request.username();
        user.setPassword(request.password());
        user.role = request.role();
        return userService.create(user)
                .map(created -> Response
                        .status(Response.Status.CREATED)
                        .entity(toResponse(created))
                        .build());
    }

    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<UserResponse> update(@PathParam("id") Long id, @Valid UserUpdateRequest request) {
        User user = new User();
        user.username = request.username();
        user.role = request.role();
        return userService.update(id, user).map(UserResource::toResponse);
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(@PathParam("id") Long id) {
        return userService.delete(id)
                .map(v -> Response.noContent().build());
    }

    private static UserResponse toResponse(User u) {
        return new UserResponse(u.id, u.fullName, u.username, u.role);
    }
}