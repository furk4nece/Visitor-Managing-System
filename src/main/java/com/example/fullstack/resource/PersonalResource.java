package com.example.fullstack.resource;

import com.example.fullstack.dto.personal.PersonalRequest;
import com.example.fullstack.dto.personal.PersonalResponse;
import com.example.fullstack.entity.Personal;
import com.example.fullstack.service.PersonalService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/v1/personals")
@RolesAllowed({"ADMIN", "RECEPTIONIST" , "SUPER_ADMIN"})
public class PersonalResource {

    private final PersonalService personalService;

    @Inject
    public PersonalResource(PersonalService personalService) {
        this.personalService = personalService;
    }

    @GET
    public Uni<List<PersonalResponse>> get() {
        return personalService.list()
                .map(list -> list.stream().map(PersonalResource::toResponse).toList());
    }

    @GET
    @Path("{id}")
    public Uni<PersonalResponse> get(@PathParam("id") Long id) {
        return personalService.findById(id).map(PersonalResource::toResponse);
    }

    @GET
    @Path("department/{department}")
    public Uni<List<PersonalResponse>> getByDepartment(@PathParam("department") String department) {
        return personalService.findByDepartment(department)
                .map(list -> list.stream().map(PersonalResource::toResponse).toList());
    }

    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @RolesAllowed({"ADMIN", "SUPER_ADMIN"})
    public Uni<Response> create(@Valid PersonalRequest request) {
        return personalService.create(toEntity(request))
                .map(created -> Response
                        .status(Response.Status.CREATED)
                        .entity(toResponse(created))
                        .build());
    }

    
    @PUT
    @Path("{id}")
    @RolesAllowed({"ADMIN", "SUPER_ADMIN"})
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<PersonalResponse> update(@PathParam("id") Long id, @Valid PersonalRequest request) {
        Personal personal = toEntity(request);
        personal.id = id;
        return personalService.update(id, personal).map(PersonalResource::toResponse);
    }

    
    @DELETE
    @Path("{id}")
    @RolesAllowed({"ADMIN", "SUPER_ADMIN"})
    public Uni<Response> delete(@PathParam("id") Long id) {
        return personalService.delete(id)
                .map(v -> Response.noContent().build());
    }

    static PersonalResponse toResponse(Personal p) {
        return new PersonalResponse(p.id, p.fullName, p.department, p.tittle, p.email);
    }

    private static Personal toEntity(PersonalRequest r) {
        Personal p = new Personal();
        p.fullName = r.fullName();
        p.department = r.department();
        p.tittle = r.tittle();
        p.email = r.email();
        return p;
    }
}