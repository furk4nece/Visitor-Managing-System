package com.example.fullstack.resource;

import com.example.fullstack.dto.visitor.VisitorCheckInRequest;
import com.example.fullstack.dto.visitor.VisitorResponse;
import com.example.fullstack.entity.Visitor;
import com.example.fullstack.service.VisitorService;
import com.example.fullstack.service.CheckoutLogService;

import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


import java.util.List;

@Path("/api/v1/visitors")
@RolesAllowed({"ADMIN", "RECEPTIONIST", "SUPER_ADMIN"})
public class VisitorResource {

    private final VisitorService visitorService;
    private final CheckoutLogService checkoutLogService;

    @Inject
    public VisitorResource(VisitorService visitorService, CheckoutLogService checkoutLogService) {
        this.visitorService = visitorService;
        this.checkoutLogService = checkoutLogService;
    }

    @GET
    @Path("active")
    public Uni<List<VisitorResponse>> getActive() {
        return visitorService.listActive()
                .map(list -> list.stream().map(VisitorResource::toResponse).toList());
    }

    @GET
    public Uni<List<VisitorResponse>> getAll() {
        return visitorService.listAll()
                .map(list -> list.stream().map(VisitorResource::toResponse).toList());
    }

    @GET
    @Path("{id}")
    public Uni<VisitorResponse> get(@PathParam("id") Long id) {
        return visitorService.findById(id).map(VisitorResource::toResponse);
    }

    @POST
    @Path("checkin")
    @Consumes(MediaType.APPLICATION_JSON)
    public Uni<Response> checkIn(@Valid VisitorCheckInRequest request) {
        return visitorService.checkIn(request.fullName(), request.hostId())
                .map(created -> Response
                        .status(Response.Status.CREATED)
                        .entity(toResponse(created))
                        .build());
    }

    @PUT
    @Path("{id}/checkout")
    public Uni<Response> checkOut(@PathParam("id") Long id) {
        checkoutLogService.logCheckout(id);
        return visitorService.checkOut(id)
                .map(updated -> Response.ok(toResponse(updated)).build());
    }

    @DELETE
    @Path("{id}")
    public Uni<Response> delete(@PathParam("id") Long id) {
        return visitorService.delete(id)
                .map(v -> Response.noContent().build());
    }

    static VisitorResponse toResponse(Visitor v) {
        return new VisitorResponse(
                v.id,
                v.fullName,
                PersonalResource.toResponse(v.host),
                v.entryTime,
                v.exitTime,
                v.isInside
        );
    }
}