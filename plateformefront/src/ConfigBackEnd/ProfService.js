import { api } from "./Api";

export const getDemandesProfesseur = () =>
  api.get("/professeurs/demandes/en-attente");

export const validerProfesseur = (demandeId) =>
  api.post(`/professeurs/demandes/valider/${demandeId}`);

export const refuserProfesseur = (demandeId) =>
  api.post(`/professeurs/demandes/refuser/${demandeId}`);

export const revoquerProfesseur = (demandeId) =>
  api.post(`/professeurs/demandes/revoquer/${demandeId}`);

export const compterDemandesProfesseur = () =>
  api.get("/professeurs/demandes/count");

export const getHistoriqueProfesseur = () =>
  api.get("/professeurs/demandes/historique");