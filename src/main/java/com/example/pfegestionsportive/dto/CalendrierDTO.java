package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.PlanningType;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CalendrierDTO {
    private UUID id;
    private String saison;
    private LocalDateTime dateGeneration;
    private PlanningType typePlanning;
    private UUID competitionId;
    private String nomCompetition;
    private List<MatchDTO> matchs;
}