package com.example.pfegestionsportive.Config;

import com.example.pfegestionsportive.model.entity.Utilisateur;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {

    private final Utilisateur utilisateur;

    public UserDetailsImpl(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    @Override
    public String getUsername() {
        return utilisateur.getEmail();
    }

    @Override
    public String getPassword() {
        return utilisateur.getMotDePasseHash();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole())
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return utilisateur.getActif();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return utilisateur.getActif();
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }
}