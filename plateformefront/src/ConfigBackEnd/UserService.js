// ConfigBackEnd/UserService.js
import { api } from "./Api";

// 🧩 Authentification
export const loginUser = (email, password) =>
  api.post("/users/connexion", { email, password });

export const logoutUser = () => api.post("/users/deconnexion");

// 🧩 Gestion des utilisateurs
export const inscription = (name, email, password, statut) =>
  api.post("/users/inscription", { name, email, password, statut });

export const activationUser = (email, code) =>
  api.post("/users/activation", { email, code });

export const getCurrentUser = () => api.get("/users/me");

export const getUserByEmail = (email) => api.get(`/users/email/${email}`);

export const userExists = (email) =>
  api.get("/users/exists", { params: { email } });
