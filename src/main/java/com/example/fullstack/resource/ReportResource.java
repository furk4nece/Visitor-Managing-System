package com.example.fullstack.resource;

import com.example.fullstack.dto.report.DailyVisitCount;
import com.example.fullstack.dto.report.HostVisitCount;
import com.example.fullstack.service.ReportService;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;


import java.util.List;

@Path("/api/v1/reports")
@RolesAllowed({"ADMIN", "RECEPTIONIST", "SUPER_ADMIN"})
public class ReportResource {

    private final ReportService reportService;

    @Inject
    public ReportResource(ReportService reportService) {
        this.reportService = reportService;
    }

    @GET
    @Path("most-visited")
    public Uni<List<HostVisitCount>> mostVisited() {
        return reportService.mostVisitedHosts();
    }

    @GET
    @Path("weekly-traffic")
    public Uni<List<DailyVisitCount>> weeklyTraffic() {
        return reportService.weeklyTraffic();
    }
}