package com.example.fullstack.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import io.restassured.internal.http.HttpResponseException;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

@QuarkusTest
public class PersonalResourceSecurityTest {

    @Test
    void unauthenticatedRequestIsRejected() {
        try {
            given()
                    .accept(ContentType.JSON)
                    .when().get("/api/v1/personals");
            fail("401 bekleniyordu ama istek basarili döndü");
        } catch (Exception e) {
            assertTrue(e instanceof HttpResponseException, "Beklenmeyen hata tipi: " + e);
            assertEquals(401, ((HttpResponseException) e).getStatusCode());
        }
    }

    @Test
    @TestSecurity(user = "resepsiyonist1", roles = "RECEPTIONIST")
    void receptionistCanViewPersonals() {
        given()
                .accept(ContentType.JSON)
                .when().get("/api/v1/personals")
                .then().statusCode(200);
    }

    @Test
    @TestSecurity(user = "resepsiyonist1", roles = "RECEPTIONIST")
    void receptionistCannotCreatePersonal() {
        given()
                .accept(ContentType.JSON)
                .contentType(ContentType.JSON)
                .body("{\"fullName\":\"Test Personel\",\"department\":\"IT\",\"tittle\":\"Uzman\",\"email\":\"test@sirket.com\"}")
                .when().post("/api/v1/personals")
                .then().statusCode(403);
    }

    @Test
    @TestSecurity(user = "resepsiyonist1", roles = "RECEPTIONIST")
    void receptionistCannotDeletePersonal() {
        try {
            given()
                    .accept(ContentType.JSON)
                    .when().delete("/api/v1/personals/1");
            fail("403 bekleniyordu ama istek basarili döndü");
        } catch (Exception e) {
            assertTrue(e instanceof HttpResponseException, "Beklenmeyen hata tipi: " + e);
            assertEquals(403, ((HttpResponseException) e).getStatusCode());
        }
    }
}