package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.VerificationCode;
import com.example.pfegestionsportive.model.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, String> {
    Optional<VerificationCode> findByEmailAndCodeAndStatut(
            String email, String code, VerificationStatus statut);
    Optional<VerificationCode> findTopByEmailAndStatutOrderByDateCreationDesc(
            String email, VerificationStatus statut);
    @Transactional
    void deleteByEmail(String email);
}