package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Arbitre;
import com.example.pfegestionsportive.model.enums.ArbitreStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArbitreRepository extends JpaRepository<Arbitre, String> {

    List<Arbitre> findByStatut(ArbitreStatut statut);
}
