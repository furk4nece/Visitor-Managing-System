package com.example.fullstack.dto.report;

public record DailyVisitCount(
    String day,
    long visitCount
) {}