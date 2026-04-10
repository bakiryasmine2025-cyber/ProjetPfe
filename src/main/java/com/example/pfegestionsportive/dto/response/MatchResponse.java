package com.example.pfegestionsportive.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MatchResponse {
    private String id;
    private String competitionId, competitionNom;
    private String equipeDomicileId, equipeDomicileNom;
    private String equipeExterieureId, equipeExterieureNom;
    private String arbitreId, arbitreNom;
    private LocalDateTime dateMatch;
    private String lieu;
    private Integer scoreDomicile, scoreExterieur;
    private String statut;
    private LocalDateTime dateCreation;
}