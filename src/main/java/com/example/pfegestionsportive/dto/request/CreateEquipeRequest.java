package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.Gender;
import lombok.Data;

@Data
public class CreateEquipeRequest {
    private String nom;
    private Gender categorie;
}
