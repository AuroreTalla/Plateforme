import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser, logoutUser } from "../../ConfigBackEnd/UserService";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!currentUser;

  // 🔁 Fonction de récupération côté backend
  const fetchCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.data);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(res.data)); // ✅ sauvegarde locale
    } catch {
      setCurrentUser(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Restauration depuis le localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      fetchCurrentUser(); // si pas trouvé, on tente depuis le backend
    }
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      console.warn("Erreur lors de la déconnexion backend");
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("currentUser");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        loading,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
