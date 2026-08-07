package com.example.fullstack;

import io.vertx.pgclient.PgException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.hibernate.ObjectNotFoundException;
import org.hibernate.StaleObjectStateException;
import org.hibernate.exception.ConstraintViolationException;
//import io.quarkus.security.UnauthorizedException;
import java.util.Optional;

@Provider
public class RestExceptionHandler implements ExceptionMapper<Exception> {

    private static final String PG_UNIQUE_VIOLATION = "23505";

    private static <T extends Throwable> Optional<T> getExceptionInChain(
            Throwable throwable, Class<T> exceptionClass) {
        while (throwable != null) {
            if (exceptionClass.isInstance(throwable)) {
                return Optional.of(exceptionClass.cast(throwable));
            }
            throwable = throwable.getCause();
        }
        return Optional.empty();
    }

    private static boolean hasExceptionInChain(
            Throwable throwable, Class<? extends Throwable> exceptionClass) {
        return getExceptionInChain(throwable, exceptionClass).isPresent();
    }

    private static boolean hasPostgresErrorCode(Throwable throwable, String code) {
        return getExceptionInChain(throwable, PgException.class)
                .filter(ex -> code.equals(ex.getCode()))
                .isPresent();
    }

    @Override
    public Response toResponse(Exception exception) {

        if (exception instanceof io.quarkus.security.UnauthorizedException) {
            return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\": \"Kullanici adi veya sifre yanlis.\"}")
                    .build();
        }

        if (exception instanceof NotFoundException) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Kayit bulunamadi.\"}")
                    .build();
        }

        if (hasExceptionInChain(exception, ObjectNotFoundException.class)) {
            return Response
                    .status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Kayit bulunamadi.\"}")
                    .build();
        }

        if (hasPostgresErrorCode(exception, PG_UNIQUE_VIOLATION)
                || hasExceptionInChain(exception, ConstraintViolationException.class)) {
            return Response
                    .status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Bu kayit zaten mevcut.\"}")
                    .build();
        }

        if (exception instanceof jakarta.validation.ConstraintViolationException cve) {
            String message = cve.getConstraintViolations().stream()
                    .map(v -> v.getMessage())
                    .findFirst()
                    .orElse("Gecersiz istek.");
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"" + message + "\"}")
                    .build();
        }

        if (hasExceptionInChain(exception, StaleObjectStateException.class)) {
            return Response
                    .status(Response.Status.CONFLICT)
                    .entity("{\"error\": \"Kayit baska biri tarafindan guncellendi.\"}")
                    .build();
        }

        if (hasExceptionInChain(exception, IllegalStateException.class)) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\": \"" + exception.getMessage() + "\"}")
                    .build();
        }

        return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("{\"error\": \"Beklenmedik bir hata olustu.\"}")
                .build();
    }
}