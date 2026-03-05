package com.example.pfegestionsportive.repository;
import com.example.pfegestionsportive.model.Suspension;
import com.example.pfegestionsportive.model.StatutSuspension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SuspensionRepository extends JpaRepository<Suspension,UUID> {
    Page<Suspension> findByMembreId(UUID membreId, Pageable pageable);

    Optional<Suspension> findByLicenceIdAndStatut(UUID licenceId,StatutSuspension statut);

    List<Suspension> findByLicenceId(UUID licenceId);

    @Query("SELECT  s FROM Suspension  s WHERE s.statut= 'ACTIVE'"+
    "AND s.typeSuspension = 'TEMPORAIRE'" +
    "AND s.dateFin <=:today")
    List<Suspension> findExpiredSuspensions(@Param("today") LocalDate today);

}
