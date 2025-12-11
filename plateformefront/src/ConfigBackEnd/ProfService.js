// ConfigBackEnd/ProfService.js
import { api } from "./Api";

/**
 * Récupère la liste des demandes professeur en attente
 */
export const listeDemandes = () => {
  return api.get("/admin/professeurs/demandes");  // ✅ GET au lieu de POST
};

/**
 * Valide un utilisateur comme professeur
 */
export const validerProf = (userId) => {
  return api.post(`/admin/professeurs/valider/${userId}`);  // ✅ Template literal correct
};

/**
 * Refuse une demande professeur
 */
export const refusProf = (userId) => {
  return api.post(`/admin/professeurs/refuser/${userId}`);  // ✅ Template literal correct
};

/**
 * Compte le nombre de demandes en attente
 */
export const compterDemandes = () => {
  return api.get("/admin/professeurs/demandes/count");
};