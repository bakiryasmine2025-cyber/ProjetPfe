package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SponsorRepository extends JpaRepository<Sponsor, UUID> {

    List<Sponsor> findByFederationId(UUID federationId);
    List<Sponsor> findByClubId(UUID clubId);
    List<Sponsor> findByActif(boolean actif);
}