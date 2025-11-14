import { api } from "./Api";
import { sendMessage } from "./WebSocketConfig";

// Créer un groupe
export const creerGroupe = (nom, description) =>
  api.post("/groupes", { nom, description });

// Récupérer tous les groupes
export const getAllGroupes = () => api.get("/groupes");

// Récupérer les messages d’un groupe
export const getMessages = (nom, size = 30, page = 0) =>
  api.get(`/groupes/${encodeURIComponent(nom)}/messages`, { params: { size, page } });

// Rejoindre un groupe
export const joinGroupe = (nom) =>
  api.post(`/groupes/${encodeURIComponent(nom)}/join`);

// Envoyer un message dans un groupe via WebSocket
export const sendGroupMessage = (nom, contenu) =>
  sendMessage(nom, contenu);

// Récupérer le dernier message
export const getLastMessage = (nom) =>
  api.get(`/groupes/${encodeURIComponent(nom)}/messages/last`);
