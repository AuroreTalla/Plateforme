import { api } from "./Api";

// Récupérer les publications d'un groupe
export const getPublicationsByGroupe = (groupeId) =>
  api.get(`/publications/groupe/${groupeId}`);

// Récupérer les réponses d'une publication
export const getReponsesByPublication = (publicationId) =>
  api.get(`/reponses/publication/${publicationId}`);

// Proposer une réponse comme solution (auteur de la publication)
export const proposerSolution = (reponseId) =>
  api.patch(`/reponses/${reponseId}/proposer-solution`);

// Valider une solution (admin/prof)
export const validerSolution = (reponseId) =>
  api.patch(`/reponses/${reponseId}/valider`);

// Dévalider une solution (admin/prof)
export const devaliderSolution = (reponseId) =>
  api.patch(`/reponses/${reponseId}/devalider`);