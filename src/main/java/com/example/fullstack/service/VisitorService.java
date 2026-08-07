package com.example.fullstack.service;

import com.example.fullstack.entity.Visitor;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.hibernate.ObjectNotFoundException;

import java.time.ZonedDateTime;
import java.util.List;

@ApplicationScoped
public class VisitorService {

    private final PersonalService personalService;

    @Inject
    public VisitorService(PersonalService personalService) {
        this.personalService = personalService;
    }

    public Uni<List<Visitor>> listActive() {
        return Visitor.list("isInside", true);
    }

    public Uni<List<Visitor>> listAll() {
        return Visitor.listAll();
    }

    public Uni<Visitor> findById(Long id) {
        return Visitor.<Visitor>findById(id)
                .onItem().ifNull().failWith(() ->
                        new ObjectNotFoundException(id, "Visitor"));
    }

    @WithTransaction
    public Uni<Visitor> checkIn(String fullName, Long hostId) {
        return personalService.findById(hostId)
                .chain(host -> {
                    Visitor visitor = new Visitor();
                    visitor.fullName = fullName;
                    visitor.host = host;
                    visitor.entryTime = ZonedDateTime.now();
                    visitor.isInside = true;
                    visitor.exitTime = null;
                    return visitor.persistAndFlush();
                });
    }

    @WithTransaction
    public Uni<Visitor> checkOut(Long id) {
        return findById(id)
                .chain(visitor -> {
                    if (!visitor.isInside) {
                        throw new IllegalStateException(
                            "Bu ziyaretçi zaten çıkış yapmış.");
                    }
                    visitor.exitTime = ZonedDateTime.now();
                    visitor.isInside = false;
                    return visitor.persistAndFlush();
                });
    }

    @WithTransaction
    public Uni<Void> delete(Long id) {
        return findById(id)
                .chain(v -> v.delete());
    }
}