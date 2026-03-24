package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SaisonRequest {
    @NotBlank
    private String nom;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private boolean active;
}