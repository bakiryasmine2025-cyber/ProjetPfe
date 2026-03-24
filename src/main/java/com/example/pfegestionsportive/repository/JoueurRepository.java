package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Joueur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JoueurRepository extends JpaRepository<Joueur, String> {
}
