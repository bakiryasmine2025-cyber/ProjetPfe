package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findAllByOrderByDateCreationDesc();
    Optional<User> findFirstByRole(Role role);
}
