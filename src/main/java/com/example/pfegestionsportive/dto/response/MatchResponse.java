package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MatchResponse {
    private String id;
    private String competitionNom;
    private String equipeDomicile;
    private String equipeExterieur;
    private LocalDateTime dateMatch;
    private String lieu;
    private String score;
    private String statut;
}
