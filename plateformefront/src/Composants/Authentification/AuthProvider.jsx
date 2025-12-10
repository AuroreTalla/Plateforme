import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import LoadingPage from "../LoadingPage.jsx";

import { getCurrentUser, logoutUser, loginUser as apiLogin } from "../../ConfigBackEnd/UserService";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!currentUser;

  // 🔁 Fonction de récupération côté backend
  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      const user = res.data;
      setCurrentUser(user);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch {
      console.log("Utilisateur non connecté ou token expiré");
      setCurrentUser(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");  // ✅ Supprimer aussi le token
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ✅ FONCTION LOGIN : Sauvegarder le token
  const login = async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      
      console.log('📦 Réponse login:', res.data);
      
      // ✅ Sauvegarder le token si présent
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        console.log('✅ Token sauvegardé:', res.data.token.substring(0, 30) + '...');
      } else {
        console.warn('⚠️ Aucun token reçu du backend');
      }
      
      // ✅ Sauvegarder l'utilisateur
      if (res?.data?.user) {
        const user = res.data.user;
        setCurrentUser(user);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false };
      
    } catch (error) {
      console.error('❌ Erreur login:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.warn("Erreur lors de la déconnexion backend", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");  // ✅ Supprimer le token
    }
  };

  // ✅ NOUVELLE FONCTION : Mettre à jour après inscription/activation
  const updateUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser: updateUser,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {loading ? <LoadingPage /> : children}

    </AuthContext.Provider>
  );
};