package com.example.pfegestionsportive.dto;
import com.example.pfegestionsportive.model.TypeSuspension;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SuspensionRequest {
    private TypeSuspension typeSuspension;
    private String motif;
    private LocalDate dateDebut;
    private LocalDate dateFin;       // null si DEFINITIVE
    private Boolean notifierClub;
}

