package com.example.fullstack;

import io.quarkus.security.UnauthorizedException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RestExceptionHandlerTest {

    private final RestExceptionHandler handler = new RestExceptionHandler();

    @Test
    void unauthorizedExceptionReturns401() {
        Response response = handler.toResponse(new UnauthorizedException("Kullanici adi veya sifre yanlis."));
        assertEquals(401, response.getStatus());
    }

    @Test
    void notFoundExceptionReturns404() {
        Response response = handler.toResponse(new NotFoundException());
        assertEquals(404, response.getStatus());
    }

    @Test
    void unknownExceptionReturns500() {
        Response response = handler.toResponse(new RuntimeException("beklenmedik hata"));
        assertEquals(500, response.getStatus());
    }
}