import axios from "axios";

export const API_BASE_URL = "http://localhost:8081";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Envoie les cookies automatiquement
  timeout: 10000,
});

// ✅ Intercepteur de réponse SANS auto-refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ NE PAS essayer de refresh automatiquement
    // Si 401, laisser l'erreur se propager
    if (error.response?.status === 401) {
      console.log("❌ 401 - Non authentifié");
      // Rediriger SEULEMENT si pas déjà sur la page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);