package com.example.pfegestionsportive.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateActualiteRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 200, message = "Titre entre 5 et 200 caractères")
    private String titre;

    @NotBlank(message = "Le contenu est obligatoire")
    @Size(min = 10, message = "Contenu minimum 10 caractères")
    private String contenu;

    private String urlImage;
    private String categorie;

}