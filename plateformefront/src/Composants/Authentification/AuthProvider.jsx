import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import LoadingPage from "../LoadingPage.jsx";
import { getCurrentUser, logoutUser, loginUser } from "../../Services/UserService.js";

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

  useEffect(() => {
  const onExpired = () => setCurrentUser(null);
  window.addEventListener("auth:expired", onExpired);
  return () => window.removeEventListener("auth:expired", onExpired);
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

  const [slow, setSlow] = useState(false);

useEffect(() => {
  if (!loading) { setSlow(false); return; }
  const t = setTimeout(() => setSlow(true), 4000);
  return () => clearTimeout(t);
}, [loading]);

useEffect(() => {
  const onExpired = () => setCurrentUser(null);
  window.addEventListener("auth:expired", onExpired);
  return () => window.removeEventListener("auth:expired", onExpired);
}, []);

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
      {loading ? (
  slow ? (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center', padding: 24 }}>
      <LoadingPage />
      <p style={{ color: '#4c1d95', fontWeight: 600 }}>Le serveur démarre, merci de patienter…</p>
      <p style={{ color: '#64748b', maxWidth: 360 }}>
        La première visite après une période d'inactivité peut prendre jusqu'à une minute.
      </p>
    </div>
  ) : <LoadingPage />
) : children}
    </AuthContext.Provider>
  );
};
