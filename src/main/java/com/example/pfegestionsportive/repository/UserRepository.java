package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByOrderByDateCreationDesc();
    Optional<User> findFirstByRole(Role role);
    List<User> findByStatut(AccountStatus statut);
    List<User> findByRole(Role role);
    List<User> findByStatutAndRole(AccountStatus statut, Role role);
    List<User> findByRoleAndStatut(Role role, AccountStatus statut);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.club WHERE u.email = :email")
    Optional<User> findByEmailWithClub(@Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_clubs_suivis WHERE club_id = :clubId", nativeQuery = true)
    void deleteClubsSuivisByClubId(@Param("clubId") String clubId);
}