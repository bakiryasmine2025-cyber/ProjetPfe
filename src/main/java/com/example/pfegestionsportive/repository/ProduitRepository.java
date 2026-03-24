package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProduitRepository extends JpaRepository<Produit, String> {
    List<Produit> findByDisponibleTrue();
    List<Produit> findByCategorie(String categorie);
}
