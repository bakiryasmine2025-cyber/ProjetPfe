package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Federation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FederationRepository extends JpaRepository<Federation, String> {
    Optional<Federation> findFirstByOrderByDateCreationAsc();
}