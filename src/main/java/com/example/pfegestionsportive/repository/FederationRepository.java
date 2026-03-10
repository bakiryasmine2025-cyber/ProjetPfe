package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Federation;
import com.example.pfegestionsportive.model.enums.FederationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface FederationRepository extends JpaRepository<Federation, UUID> {
    List<Federation> findByStatut(FederationStatus statut);
    boolean existsByCode(String code);
    long countByFederationId(UUID federationId);
}