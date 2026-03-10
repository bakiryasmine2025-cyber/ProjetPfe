package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Club;
import com.example.pfegestionsportive.model.enums.ClubStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClubRepository extends JpaRepository<Club, UUID> {
    List<Club> findByFederationId(UUID federationId);
    List<Club> findByStatut(ClubStatus statut);
    List<Club> findByVille(String ville);
    long countByFederationId(UUID federationId);
    long countByClubId(UUID clubId);
}