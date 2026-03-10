package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Licence;
import com.example.pfegestionsportive.model.enums.LicenseStatus;
import com.example.pfegestionsportive.model.enums.LicenseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface LicenceRepository extends JpaRepository<Licence, UUID> {

    List<Licence> findByStatut(LicenseStatus statut);
    List<Licence> findByType(LicenseType type);
    List<Licence> findByClubId(UUID clubId);
    List<Licence> findByPersonneId(UUID personneId);

    long countByStatut(LicenseStatus statut);
    long countByClubIdAndStatut(UUID clubId, LicenseStatus statut);

    List<Licence> findTop5ByStatutOrderByDateEmissionDesc(LicenseStatus statut);

    @Query("SELECT l FROM Licence l WHERE l.club.id = :clubId " +
            "AND l.dateExpiration <= :date AND l.statut = 'ACTIVE'")
    List<Licence> findLicencesExpirantBientot(
            @Param("clubId") UUID clubId,
            @Param("date") LocalDate date);

    @Query("SELECT l FROM Licence l WHERE l.dateExpiration < :today " +
            "AND l.statut = 'ACTIVE'")
    List<Licence> findLicencesExpirees(@Param("today") LocalDate today);

    boolean existsByPersonneIdAndStatut(UUID personneId, LicenseStatus statut);
}