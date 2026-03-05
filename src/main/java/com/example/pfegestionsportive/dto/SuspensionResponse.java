package com.example.pfegestionsportive.dto;
import com.example.pfegestionsportive.model.TypeSuspension;
import com.example.pfegestionsportive.model.StatutSuspension;
import lombok.Data;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SuspensionResponse {
    private UUID id;
    private UUID licenceId;
    private Long membreId;
    private String membreUsername;
    private TypeSuspension typeSuspension;
    private StatutSuspension statut;
    private String motif;
    private LocalDate dateDebut;
    private  LocalDate dateFin;
    private String raisonLevee;
    private Long creeParId;
    private LocalDateTime creeAt;
    private LocalDateTime dateLevee;
}
