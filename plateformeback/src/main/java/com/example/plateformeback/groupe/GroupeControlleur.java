package com.example.plateformeback.groupe;

import com.example.plateformeback.user.UsersService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping(path = "groupes")
public class GroupeControlleur {

    private final GroupeService groupeService;

    // Créer un groupe
    @PostMapping
    public Groupe creerGroupe(@RequestBody Groupe groupe) {
        return groupeService.creerGroupe(groupe);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> supprimerGroupe(@PathVariable Long id) {
    try {
        groupeService.supprimerGroupe(id);
        return ResponseEntity.ok(Map.of("message", "Groupe supprimé avec succès"));
    } catch (IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
    }
}


    @GetMapping
public List<GroupeDTO> getAllGroupes() {
    return groupeService.getAllGroupesDTO();
}


}