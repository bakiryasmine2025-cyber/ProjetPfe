package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SuspendreDTO {

    @NotBlank(message = "Le motif de suspension est obligatoire")
    private String motif;

    private String commentaire;
}