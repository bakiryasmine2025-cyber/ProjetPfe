package com.example.pfegestionsportive.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "federations")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Federation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String pays;
    private String code;
    private String devise;
    private String langueOfficielle;
    private Integer anneeFondation;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    @OneToMany(mappedBy = "federation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Club> clubs;
}