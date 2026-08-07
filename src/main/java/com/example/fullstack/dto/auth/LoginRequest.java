package com.example.fullstack.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Kullanici adi bos birakilamaz.") String username,
        @NotBlank(message = "Sifre bos birakilamaz.") String password
) {}