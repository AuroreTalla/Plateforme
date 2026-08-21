import { api } from "./Api";

// Créer un groupe
export const creerGroupe = (nom, description) =>
  api.post("/groupes", { nom, description });

// Récupérer tous les groupes
export const getAllGroupes = () => api.get("/groupes");

// ✅ Messages d'un groupe
export const getMessages = (groupeId, size = 30, page = 0) =>
  api.get(`/groupes/${groupeId}/messages`, { 
    params: { size, page } 
  });


// ✅ Dernier message
export const getLastMessage = (groupeId) =>
  api.get(`/groupes/${groupeId}/messages/last`);