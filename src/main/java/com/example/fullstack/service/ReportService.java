package com.example.fullstack.service;

import com.example.fullstack.dto.report.DailyVisitCount;
import com.example.fullstack.dto.report.HostVisitCount;
import com.example.fullstack.entity.Visitor;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.Map;
import java.util.ArrayList;
import java.time.ZonedDateTime;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import io.quarkus.hibernate.reactive.panache.common.WithSession;

@ApplicationScoped
public class ReportService {
    
        @WithSession
        public Uni<List<HostVisitCount>> mostVisitedHosts() {
                return Visitor.<Visitor>listAll()
                        .map(visitors -> visitors.stream()
                                .collect(Collectors.groupingBy(v -> v.host.fullName, Collectors.counting()))
                                .entrySet().stream()
                                .map(e -> new HostVisitCount(e.getKey(), e.getValue()))
                                .sorted(Comparator.comparingLong(HostVisitCount::visitCount).reversed())
                                .toList());
        }

        @WithSession
        public Uni<List<DailyVisitCount>> weeklyTraffic() {
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime weekAgo = now.toLocalDate().minusDays(6).atStartOfDay(now.getZone());
        return Visitor.<Visitor>list("entryTime >= ?1", weekAgo)
                .map(visitors -> {
                        Map<LocalDate, Long> counts = visitors.stream()
                                .collect(Collectors.groupingBy(v -> v.entryTime.toLocalDate(), Collectors.counting()));
                        List<DailyVisitCount> result = new ArrayList<>();
                        for (int i = 6; i >= 0; i--) {
                        LocalDate date = now.toLocalDate().minusDays(i);
                        String dayName = date.getDayOfWeek().getDisplayName(TextStyle.FULL, new Locale("tr"));
                        result.add(new DailyVisitCount(dayName, counts.getOrDefault(date, 0L)));
                        }
                        return result;
                });
        }
}