package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Personne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PersonneRepository extends JpaRepository<Personne, UUID> {

    List<Personne> findByClubId(UUID clubId);

    // Joueurs du club (sans profil staff ni arbitre)
    @Query("SELECT p FROM Personne p WHERE p.club.id = :clubId " +
            "AND p.profilStaff IS NULL AND p.profilArbitre IS NULL")
    List<Personne> findJoueursByClubId(@Param("clubId") UUID clubId);

    // Entraîneurs du club
    @Query("SELECT p FROM Personne p INNER JOIN ProfilStaff s ON s.personne.id = p.id " +
            "WHERE p.club.id = :clubId AND s.typeStaff = 'ENTRAINEUR'")
    List<Personne> findEntraineursByClubId(@Param("clubId") UUID clubId);

    // Staff technique du club
    @Query("SELECT p FROM Personne p INNER JOIN ProfilStaff s ON s.personne.id = p.id " +
            "WHERE p.club.id = :clubId AND s.typeStaff != 'ENTRAINEUR'")
    List<Personne> findStaffByClubId(@Param("clubId") UUID clubId);

    // Counts pour dashboard
    @Query("SELECT COUNT(p) FROM Personne p WHERE p.club.federation.id = :fedId " +
            "AND p.profilStaff IS NULL AND p.profilArbitre IS NULL")
    long countJoueursByFederationId(@Param("fedId") UUID fedId);

    @Query("SELECT COUNT(p) FROM Personne p WHERE p.profilArbitre IS NOT NULL " +
            "AND p.club.federation.id = :fedId")
    long countArbitresByFederationId(@Param("fedId") UUID fedId);

    @Query("SELECT COUNT(p) FROM Personne p " +
            "INNER JOIN AffectationEquipe a ON a.personne.id = p.id " +
            "INNER JOIN Equipe e ON a.equipe.id = e.id WHERE e.club.id = :clubId")
    long countJoueursByClubId(@Param("clubId") UUID clubId);

    @Query("SELECT COUNT(p) FROM Personne p INNER JOIN ProfilStaff s ON s.personne.id = p.id " +
            "WHERE p.club.id = :clubId AND s.typeStaff = 'ENTRAINEUR'")
    long countEntraineursByClubId(@Param("clubId") UUID clubId);

    @Query("SELECT COUNT(p) FROM Personne p INNER JOIN ProfilStaff s ON s.personne.id = p.id " +
            "WHERE p.club.id = :clubId AND s.typeStaff != 'ENTRAINEUR'")
    long countStaffByClubId(@Param("clubId") UUID clubId);
}