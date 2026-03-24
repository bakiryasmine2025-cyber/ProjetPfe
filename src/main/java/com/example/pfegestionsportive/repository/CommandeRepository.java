package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommandeRepository extends JpaRepository<Commande, String> {
    List<Commande> findByUserId(String userId);
}
