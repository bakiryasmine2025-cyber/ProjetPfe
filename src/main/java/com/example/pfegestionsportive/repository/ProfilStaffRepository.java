package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.ProfilStaff;
import com.example.pfegestionsportive.model.enums.StaffType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfilStaffRepository extends JpaRepository<ProfilStaff, UUID> {
    Optional<ProfilStaff> findByPersonneId(UUID personneId);
    List<ProfilStaff> findByTypeStaff(StaffType typeStaff);
    boolean existsByPersonneId(UUID personneId);
}