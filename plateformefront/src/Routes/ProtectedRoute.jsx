import { useContext } from "react";
import { AuthContext } from "../Pages/Inscription/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) return <div>Chargement...</div>; // attend la réponse backend

  if (!currentUser) return <Navigate to="/" replace />; // non connecté

  return children || <Outlet />;
}
