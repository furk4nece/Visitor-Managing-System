package com.example.fullstack.dto.visitor;

import com.example.fullstack.dto.personal.PersonalResponse;

import java.time.ZonedDateTime;

public record VisitorResponse(
    Long id,
    String fullName,
    PersonalResponse host,
    ZonedDateTime entryTime,
    ZonedDateTime exitTime,
    boolean isInside
) {}