package com.example.pfegestionsportive.repository;
import com.example.pfegestionsportive.model.Federation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FederationRepository extends JpaRepository<Federation,Long> {
    Optional<Federation> findByCode(String code);
    Optional<Federation> findByNom(String nom);
    Boolean existsByCode(String code);
    Boolean existsByNom(String nom);
}
