import { useEffect } from "react";
import { enregistrerConsultation } from "../Services/ConsultationService";

/** Enregistre une consultation à l'affichage d'une ressource. N'affecte jamais l'interface. */
export function useTrackConsultation(type, id) {
  useEffect(() => {
    if (!type || !id) return;
    enregistrerConsultation(type, id).catch(() => {});
  }, [type, id]);
}