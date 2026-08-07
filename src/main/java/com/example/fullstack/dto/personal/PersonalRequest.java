package com.example.fullstack.dto.personal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PersonalRequest(
    @NotBlank(message = "Isim bos birakilamaz.") String fullName,
    @NotBlank(message = "Departman bos birakilamaz.") String department,
    @NotBlank(message = "Unvan bos birakilamaz.") String tittle,
    @NotBlank(message = "E-posta bos birakilamaz.")
    @Email(message = "Gecerli bir e-posta giriniz.") String email
) {}