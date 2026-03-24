package com.example.pfegestionsportive.dto.request;

import com.example.pfegestionsportive.model.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddStaffRequest {
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private Gender genre;
    private String telephone;
    private String email;
    private String typeStaff;
    private String qualification;
    private Integer anneeExperience;
}
