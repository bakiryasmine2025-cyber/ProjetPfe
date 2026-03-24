package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Arbitre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArbitreRepository extends JpaRepository<Arbitre, String> {
}
