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

export const getUserByName = (name) => api.get(`/users/name/${name}`);

export const userExists = (email) =>
  api.get("/users/exists", { params: { email } });

export const getAllUsers = () => api.get("/users");

export const changerMotDePasse = (ancienMotDePasse, nouveauMotDePasse) =>
  api.patch("/users/password", { ancienMotDePasse, nouveauMotDePasse });

export const modifierProfil = (name) =>
  api.patch("/users/profil", { name });

export const demanderReinitialisation = (email) =>
  api.post("/users/mot-de-passe-oublie", { email });

export const reinitialiserMotDePasse = (code, nouveauMotDePasse) =>
  api.post("/users/reinitialiser-mot-de-passe", { code, nouveauMotDePasse });