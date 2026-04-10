
package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.enums.PartenaireStatut;
import com.example.pfegestionsportive.model.entity.Partenaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PartenaireRepository extends JpaRepository<Partenaire, String> {

    List<Partenaire> findByClubId(String clubId);
    List<Partenaire> findAllByOrderByDateCreationDesc();
    List<Partenaire> findByClubIsNullAndStatut(PartenaireStatut statut);

    @Modifying
    @Transactional
    @Query("DELETE FROM Partenaire p WHERE p.club.id = :clubId")
    void deleteByClubId(@Param("clubId") String clubId);
}
