package com.example.fullstack.dto.user;

public record UserUpdateRequest(
    String username,
    String role
) {}
