package com.example.plateformeback.recommendation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.plateformeback.enums.TypeRessourceConsulte;
import com.example.plateformeback.user.Users;

import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/recommandations")
public class RecommandationControlleur {

    private final RecommandationProvider recommandationProvider;

    @GetMapping
    public List<RecommandationDTO> recommander(
            @RequestParam TypeRessourceConsulte type,
            @RequestParam Long id,
            @RequestParam(defaultValue = "5") int limite,
            Authentication auth) {
        Users user = (Users) auth.getPrincipal();
        if (!user.isRecommandationsActives()) return List.of();
        return recommandationProvider.recommander(type, id, limite);
    }
}