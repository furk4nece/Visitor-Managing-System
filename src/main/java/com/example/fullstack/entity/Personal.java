package com.example.fullstack.entity;

import jakarta.persistence.*;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;

@Entity
@Table(name = "personals")
public class Personal extends PanacheEntity {

    @Column(nullable = false)
    public String fullName;

    @Column(nullable = false)
    public String department;

    @Column(nullable = false)
    public String tittle;

    @Column(unique = true, nullable = false)
    public String email;

}