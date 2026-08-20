import { api } from "./Api";

export const getAllMatieres = () => api.get("/matieres");
export const getMatiereById = (id) => api.get(`/matieres/${id}`);
export const creerMatiere = (nom, description) => api.post("/matieres", { nom, description });
export const supprimerMatiere = (id) => api.delete(`/matieres/${id}`);

export const getCoursByMatiere = (matiereId) => api.get(`/matieres/${matiereId}/cours`);
export const ajouterCours = (matiereId, titre, type, contenu, mediaUrl, ordre = 0) =>
  api.post(`/matieres/${matiereId}/cours`, { titre, type, contenu, mediaUrl, ordre });
export const supprimerCours = (coursId) => api.delete(`/matieres/cours/${coursId}`);

export const getExercicesByMatiere = (matiereId) => api.get(`/matieres/${matiereId}/exercices`);
export const ajouterExercice = (matiereId, titre, type, contenu, mediaUrl, ordre = 0) =>
  api.post(`/matieres/${matiereId}/exercices`, { titre, type, contenu, mediaUrl, ordre });
export const supprimerExercice = (exerciceId) => api.delete(`/matieres/exercices/${exerciceId}`);