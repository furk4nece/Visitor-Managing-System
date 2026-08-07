package com.example.fullstack.dto.personal;

public record PersonalResponse(
    Long id,
    String fullName,
    String department,
    String tittle,
    String email
) {}