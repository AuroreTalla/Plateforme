// ConfigBackEnd/Api.js
import axios from "axios";

export const baseURL = "http://localhost:8081";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ Les cookies JWT sont automatiquement envoyés
});

// ✅ NOUVEAU : Intercepteur pour ajouter le token depuis localStorage si disponible
api.interceptors.request.use(
  (config) => {
    // Si un token existe dans localStorage, l'ajouter au header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Token ajouté au header');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⚠️ Ne JAMAIS intercepter ces endpoints
    if (
      originalRequest.url?.includes("/connexion") ||
      originalRequest.url?.includes("/inscription") ||
      originalRequest.url?.includes("/refresh-token") ||
      originalRequest.url?.includes("/activation")
    ) {
      return Promise.reject(error);
    }

    // 🔄 Gestion du 401 (token expiré)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si un refresh est déjà en cours, mettre en file d'attente
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Appeler le refresh endpoint
        const response = await api.post("/users/refresh-token");
        
        // ✅ Si le backend renvoie un nouveau token en JSON, le sauvegarder
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
          console.log('✅ Token rafraîchi et sauvegardé');
        }
        
        isRefreshing = false;
        processQueue(null);

        // ✅ Réessayer la requête originale
        return api(originalRequest);
        
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        
        // ❌ Le refresh a échoué → déconnecter l'utilisateur
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        
        // Rediriger vers la page de connexion
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);