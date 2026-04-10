package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Joueur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoueurRepository extends JpaRepository<Joueur, String> {

    List<Joueur> findByStatut(String statut);

    List<Joueur> findByClubId(String clubId);

    List<Joueur> findByStatutAndClubId(String statut, String clubId);

    long countByClubId(String clubId);

    // ✅ FIX: native query — jointure directe sur personnes.club_id
    // JPQL "j.club" ne fonctionne pas avec JOINED inheritance car Hibernate
    // cherche joueurs.club_id qui n'existe pas
    @Query(value = """
        SELECT j.*, p.club_id, p.nom, p.prenom, p.date_naissance,
               p.genre, p.telephone, p.email, p.url_photo, p.date_creation
        FROM joueurs j
        JOIN personnes p ON j.id = p.id
        """, nativeQuery = true)
    List<Joueur> findAllWithClub();

    @Query(value = """
        SELECT j.*, p.club_id, p.nom, p.prenom, p.date_naissance,
               p.genre, p.telephone, p.email, p.url_photo, p.date_creation
        FROM joueurs j
        JOIN personnes p ON j.id = p.id
        WHERE j.id = :id
        """, nativeQuery = true)
    Optional<Joueur> findByIdWithClub(@Param("id") String id);

    // ✅ تحديث club_id في personnes بعد الإنشاء (JOINED inheritance)
    @Modifying
    @Transactional
    @Query(value = "UPDATE personnes SET club_id = :clubId WHERE id = :joueurId", nativeQuery = true)
    void updatePersonneClubId(@Param("joueurId") String joueurId, @Param("clubId") String clubId);

    // ✅ حذف من equipe_joueurs
    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM equipe_joueurs
        WHERE joueur_id IN (
            SELECT id FROM personnes WHERE club_id = :clubId
        )
        """, nativeQuery = true)
    void deleteEquipeJoueursByClubId(@Param("clubId") String clubId);

    // ✅ حذف من joueurs
    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM joueurs
        WHERE id IN (
            SELECT id FROM personnes WHERE club_id = :clubId
        )
        """, nativeQuery = true)
    void deleteJoueursByClubId(@Param("clubId") String clubId);

    // ✅ حذف من personnes
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM personnes WHERE club_id = :clubId", nativeQuery = true)
    void deletePersonnesByClubId(@Param("clubId") String clubId);
}