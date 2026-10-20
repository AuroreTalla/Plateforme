package com.example.plateformeback.recommendation;
import com.example.plateformeback.enums.TypeRessourceConsulte;
import java.util.List;

public interface RecommandationProvider {
    List<RecommandationDTO> recommander(TypeRessourceConsulte type, Long id, int limite);
}