package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Licence;
import com.example.pfegestionsportive.model.enums.LicenceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface LicenceRepository extends JpaRepository<Licence, String> {

    List<Licence> findByClubId(String clubId);
    List<Licence> findByStatut(LicenceStatus statut);
    Optional<Licence> findByPersonneIdAndStatut(String personneId, LicenceStatus statut);
    boolean existsByPersonneIdAndStatut(String personneId, LicenceStatus statut);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM licences WHERE club_id = :clubId", nativeQuery = true)
    void deleteByClubId(@Param("clubId") String clubId);
}