package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.ContratSponsoring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContratSponsoringRepository extends JpaRepository<ContratSponsoring, String> {
    List<ContratSponsoring> findByPartenaireId(String partenaireId);
    List<ContratSponsoring> findByActifTrue();
}
