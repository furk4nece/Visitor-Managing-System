package com.example.fullstack.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(

        @NotBlank(message = "Ad Soyad boş olamaz")
        String fullName,

        @NotBlank(message = "Kullanıcı adı boş olamaz")
        String username,

        String currentPassword,

        String newPassword,

        String confirmPassword

) {
}