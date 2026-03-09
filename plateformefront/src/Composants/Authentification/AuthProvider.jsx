import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import LoadingPage from "../LoadingPage.jsx";
import { getCurrentUser, logoutUser, loginUser } from "../../ConfigBackEnd/UserService";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Récupérer l'utilisateur depuis le backend
  const fetchCurrentUser = async () => {
    try {
      console.log("🔍 Récupération utilisateur...");

      // ✅ Le cookie est envoyé automatiquement par le navigateur
      const res = await getCurrentUser();
      const user = res.data;

      console.log("✅ Utilisateur:", user.email, user.statut);
      setCurrentUser(user);

    } catch (error) {
      console.log("❌ Pas d'utilisateur connecté:", error.response?.status);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
  try {
    await loginUser(email, password);

    await fetchCurrentUser();

    return { success: true };

  } catch (error) {
    setCurrentUser(null);
    return {
      success: false,
      error: error.response?.data?.message || "Erreur de connexion"
    };
  }
};

  const logout = async () => {
    try {
      console.log("🚪 Déconnexion...");
      // ✅ Backend va supprimer les cookies
      await logoutUser();
    } catch (error) {
      console.warn("⚠️ Erreur déconnexion:", error);
    } finally {
      setCurrentUser(null);
      console.log("✅ Déconnexion complète");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
        setCurrentUser,
      }}
    >
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
};
