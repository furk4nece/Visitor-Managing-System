package com.example.fullstack.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {

    @Column(unique = true, nullable = false)
    public String username;

    @Column(name = "full_name", nullable = false)
    public String fullName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    public String role; 

    @JsonProperty("password")
    public void setPassword(String password){
        this.password = password;
    }

    public String getPassword(){
        return password;
    }
}