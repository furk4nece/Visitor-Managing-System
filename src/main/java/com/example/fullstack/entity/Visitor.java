package com.example.fullstack.entity;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "visitors")
public class Visitor extends PanacheEntity {

    @Column(nullable = false)
    public String fullName;

    @ManyToOne
    @JoinColumn(name = "host_id", nullable = false)
    public Personal host;

    @Column(nullable = false)
    public ZonedDateTime entryTime;

    public ZonedDateTime exitTime;

    @Column(nullable = false)
    public boolean isInside;
}