import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
});

// Ces routes ne doivent jamais déclencher de refresh (évite les boucles)
const SANS_REFRESH = ["/users/refresh-token", "/users/connexion", "/users/deconnexion"];

// Une seule requête de refresh à la fois, partagée par tous les appels en échec
let refreshEnCours = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || "";

    if (
      status !== 401 ||
      !original ||
      original._retry ||
      SANS_REFRESH.some((u) => url.includes(u))
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshEnCours) {
        refreshEnCours = api
          .post("/users/refresh-token")
          .finally(() => { refreshEnCours = null; });
      }
      await refreshEnCours;
      return api(original);               // rejoue la requête initiale
    } catch {
      window.dispatchEvent(new Event("auth:expired"));
      return Promise.reject(error);
    }
  }
);