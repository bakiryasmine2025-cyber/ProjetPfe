package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Partenaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartenaireRepository extends JpaRepository<Partenaire, String> {
    List<Partenaire> findByClubId(String clubId);
    List<Partenaire> findAllByOrderByDateCreationDesc();
}
