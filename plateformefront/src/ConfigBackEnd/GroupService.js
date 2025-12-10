import { api } from "./Api";

// Créer un groupe
export const creerGroupe = (nom, description) =>
  api.post("/groupes", { nom, description });

// Récupérer tous les groupes
export const getAllGroupes = () => api.get("/groupes");

// ✅ Messages d'un groupe
export const getMessages = (nom, size = 30, page = 0) =>
  api.get(`/groupes/${encodeURIComponent(nom)}/messages`, { 
    params: { size, page } 
  });

// ✅ SIMPLIFIÉ : Pas besoin de gérer le token manuellement
export const joinGroupe = async (groupeNom) => {
  console.log('📤 Tentative de rejoindre:', groupeNom);
  
  try {
    const response = await api.post('/groupes/join', { nom: groupeNom });
    console.log('✅ Groupe rejoint:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Erreur join:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Dernier message
export const getLastMessage = (nom) =>
  api.get(`/groupes/${encodeURIComponent(nom)}/messages/last`);