package com.example.pfegestionsportive.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ActualiteResponse {
    private String id;
    private String titre;
    private String contenu;
    private String urlImage;
    private LocalDateTime datePublication;
    private String clubNom;
    private String categorie;

}
