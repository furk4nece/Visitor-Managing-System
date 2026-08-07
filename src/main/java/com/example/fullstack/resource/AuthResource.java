package com.example.fullstack.resource;

import com.example.fullstack.dto.auth.LoginRequest;
import com.example.fullstack.dto.auth.LoginResponse;
import com.example.fullstack.service.AuthService;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/v1/auth")
public class AuthResource {

    private final AuthService authService;

    @Inject
    public AuthResource(AuthService authService) {
        this.authService = authService;
    }

    @POST
    @Path("login")
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<Response> login(@Valid LoginRequest request) {
        return authService.login(request.username(), request.password())
                .map(token -> Response
                        .ok(new LoginResponse(token))
                        .build());
    }
}