
package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class TicketRequest {
    @NotBlank(message = "matchId est obligatoire")
    private String matchId;

    @NotBlank(message = "categorie est obligatoire")
    @Pattern(regexp = "TRIBUNE|VIP|PELOUSE", message = "Categorie doit etre TRIBUNE, VIP ou PELOUSE")
    private String categorie;
}