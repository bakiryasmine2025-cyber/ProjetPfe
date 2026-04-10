package com.example.pfegestionsportive.Security;

import com.example.pfegestionsportive.model.entity.User;
import com.example.pfegestionsportive.model.enums.AccountStatus;
import com.example.pfegestionsportive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // ── Vérification du statut du compte ──────────────────────────────
        boolean enabled    = user.getStatut() != AccountStatus.INACTIVE
                && user.getStatut() != AccountStatus.REJECTED;

        boolean nonLocked  = user.getStatut() != AccountStatus.SUSPENDED
                && user.getStatut() != AccountStatus.INACTIVE;

        // PENDING_APPROVAL = email vérifié mais en attente fédération
        // → compte enabled mais credentials non valides pour accéder aux APIs protégées
        boolean credentialsValid = user.getStatut() == AccountStatus.ACTIVE
                || user.getRole() == com.example.pfegestionsportive.model.enums.Role.FEDERATION_ADMIN
                || user.getRole() == com.example.pfegestionsportive.model.enums.Role.SUPER_ADMIN;
        // ──────────────────────────────────────────────────────────────────

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getMotDePasseHash())
                .roles(user.getRole().name())
                .disabled(!enabled)
                .accountLocked(!nonLocked)
                .credentialsExpired(!credentialsValid)
                .build();
    }
}