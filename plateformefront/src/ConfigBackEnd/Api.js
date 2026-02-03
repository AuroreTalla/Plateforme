import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/",
  withCredentials: true, // ✅ Envoie les cookies automatiquement
  timeout: 10000,
});

// ✅ Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token ajouté au header Authorization");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Intercepteur de réponse SANS auto-refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ NE PAS essayer de refresh automatiquement
    // Si 401, laisser l'erreur se propager
    if (error.response?.status === 401) {
      console.log("❌ 401 - Non authentifié");
      // Nettoyer le token invalide
      sessionStorage.removeItem("jwt_token");
      sessionStorage.removeItem("refresh_token");
      // Rediriger SEULEMENT si pas déjà sur la page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);