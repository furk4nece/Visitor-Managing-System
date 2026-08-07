package com.example.fullstack.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserCreateRequest(
    @NotBlank(message = "Kullanici adi bos birakilamaz.")
    String username,
    
    @NotBlank(message = "Sifre bos birakilamaz.")
    String password,

    @NotBlank(message = "Rol bos birakilamaz.")
    String role
) {}
