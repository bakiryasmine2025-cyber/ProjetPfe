package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.MatchStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MatchRequest {
    private String competitionId;
    private String equipeDomicileId;
    private String equipeExterieurId;
    private LocalDateTime dateMatch;
    private String lieu;
    private Integer scoreDomicile;
    private Integer scoreExterieur;
    private MatchStatus statut;
    private String arbitreId;
}
