package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.StaffTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffTechniqueRepository extends JpaRepository<StaffTechnique, String> {
}
