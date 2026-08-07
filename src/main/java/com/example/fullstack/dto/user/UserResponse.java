package com.example.fullstack.dto.user;

public record UserResponse(
    Long id,
    String fullName,
    String username,
    String role
) {}
