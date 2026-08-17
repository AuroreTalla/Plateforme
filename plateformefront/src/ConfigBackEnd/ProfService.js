import { api } from "./Api";

export const getDemandesProfesseur = () =>
  api.get("/admin/professeurs/demandes");

export const validerProfesseur = (userId) =>
  api.post(`/admin/professeurs/valider/${userId}`);

export const refuserProfesseur = (userId) =>
  api.post(`/admin/professeurs/refuser/${userId}`);