package com.example.fullstack.service;

import com.example.fullstack.entity.Personal;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import org.hibernate.ObjectNotFoundException;

import java.util.List;

@ApplicationScoped
public class PersonalService {

    public Uni<List<Personal>> list() {
        return Personal.listAll(); //SELECT * FROM personals
    }

    public Uni<Personal> findById(Long id) {
        return Personal.<Personal>findById(id) //SELECT * FROM personals WHERE id = ?
                .onItem().ifNull().failWith(() ->
                        new ObjectNotFoundException(id, "Personal"));
    }

    @WithTransaction
    public Uni<Personal> create(Personal personal) { //INSERT INTO personals
        return personal.persistAndFlush();
    }

    @WithTransaction
    public Uni<Personal> update(Long id, Personal personal) {
        return findById(id)
                .chain(p -> Personal.getSession())
                .chain(s -> s.merge(personal));
    }

    @WithTransaction
    public Uni<Void> delete(Long id) {
        return findById(id)
                .chain(p -> p.delete());
    }

    public Uni<List<Personal>> findByDepartment(String department) {
        return Personal.list("department", department);
    }
}







