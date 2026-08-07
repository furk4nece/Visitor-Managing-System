package com.example.fullstack.dto.visitor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VisitorCheckInRequest(
    @NotBlank(message = "Ziyaretci ismi bos birakilamaz.") String fullName,
    @NotNull(message = "Kimi ziyaret edecegi secilmelidir.") Long hostId
) {}