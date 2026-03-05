package com.example.pfegestionsportive.service;
import com.example.pfegestionsportive.model.Club;
import com.example.pfegestionsportive.model.Federation;
import com.example.pfegestionsportive.repository.ClubRepository;
import com.example.pfegestionsportive.repository.FederationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor

public class ClubService implements ClubInterfaceService {
    private final ClubRepository clubRepository;
    private final FederationRepository federationRepository;

    @Override
    public Club createClub( Club club) {
        try {
            System.out.println(":club"+club);
            if (club!= null && club.getFederation() != null && club.getFederation().getId()!= null) {
                Long federationId = club.getFederation().getId();
                Federation federation = federationRepository.findById(federationId)
                        .orElseThrow(() -> new FederationNotFoundException("Fédération non trouvée avec l'id: " + federationId));
                club.setFederation(federation);
                Club savedClub = clubRepository.save(club);
                return savedClub;

            }

        } catch (FederationNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création du club: " + e.getMessage());
        }
        return null ;
    }

    @Override
    public List<Club> getAllClubs() {
        try {
            return clubRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des clubs: " + e.getMessage());
        }
    }

    @Override
    public List<Club> getClubsByFederation(Long federationId) {
        try {
            return clubRepository.findByFederationId(federationId);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des clubs de la fédération: " + e.getMessage());
        }
    }

    @Override
    public Club getClubById(Long id) {
        try {
            return clubRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Club non trouvé avec l'id: " + id));
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération du club avec l'id: " + id + " - " + e.getMessage());
        }
    }

    @Override
    public Club updateClub(Long id, Club club) {
        try {
            Club existing = getClubById(id);
            existing.setNom(club.getNom());
            existing.setVille(club.getVille());
            existing.setRegion(club.getRegion());
            existing.setAnneeFondation(club.getAnneeFondation());
            existing.setStatut(club.getStatut());
            return clubRepository.save(existing);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la mise à jour du club avec l'id: " + id + " - " + e.getMessage());
        }
    }

    @Override
    public void deleteClub(Long id) {
        try {
            if (!clubRepository.existsById(id)) {
                throw new RuntimeException("Club non trouvé avec l'id: " + id);
            }
            clubRepository.deleteById(id);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression du club avec l'id: " + id + " - " + e.getMessage());
        }
    }

}
