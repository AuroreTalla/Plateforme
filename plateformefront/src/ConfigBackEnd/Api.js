import axios from "axios";

export const API_BASE_URL = "http://localhost:8081";

export const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/",
=======
  baseURL: API_BASE_URL,
>>>>>>> origin/main
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
      if (!window.location.pathname.includes('/connexion')) {
        window.location.href = "/connexion";
      }
    }
    return Promise.reject(error);
  }
);