package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateMatchRequest {

    @NotBlank(message = "Équipe domicile obligatoire")
    private String equipeDomicileId;

    @NotBlank(message = "Équipe extérieur obligatoire")
    private String equipeExterieurId;

    @NotNull(message = "Date du match obligatoire")
    private LocalDateTime dateMatch;

    private String lieu;

    private String competitionId; // optionnel

    private String statut = "PROGRAMME";
}