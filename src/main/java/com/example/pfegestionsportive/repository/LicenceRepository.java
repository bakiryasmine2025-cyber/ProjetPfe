package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Licence;
import com.example.pfegestionsportive.model.enums.LicenceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LicenceRepository extends JpaRepository<Licence, String> {
    List<Licence> findByPersonne_Club_Id(String clubId);
    List<Licence> findByStatut(LicenceStatus statut);
    Optional<Licence> findByNumero(String numero);
}