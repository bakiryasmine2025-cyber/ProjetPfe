package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.StaffTechnique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StaffTechniqueRepository extends JpaRepository<StaffTechnique, String> {

    List<StaffTechnique> findByClubId(String clubId);

    @Modifying
    @Transactional
    @Query(value = """
        DELETE FROM staff_technique
        WHERE id IN (
            SELECT id FROM personnes WHERE club_id = :clubId
        )
        """, nativeQuery = true)
    void deleteStaffByClubId(@Param("clubId") String clubId);
}