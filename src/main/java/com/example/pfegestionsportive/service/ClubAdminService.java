package com.example.pfegestionsportive.service;

import com.example.pfegestionsportive.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClubAdminService {

    private final JoueurRepository joueurRepository;
    private final StaffTechniqueRepository staffTechniqueRepository;
    private final EquipeRepository equipeRepository;
    private final PersonneRepository personneRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    // Methods for 5.1 and 5.3 will be added here
}
