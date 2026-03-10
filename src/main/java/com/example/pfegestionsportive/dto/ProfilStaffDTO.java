package com.example.pfegestionsportive.dto;

import com.example.pfegestionsportive.model.enums.StaffType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProfilStaffDTO {
    private UUID id;
    private UUID personneId;
    private String nomPersonne;
    private String prenomPersonne;

    @NotNull(message = "Type staff obligatoire")
    private StaffType typeStaff;

    private String qualification;
    private Integer anneesExperience;
}
