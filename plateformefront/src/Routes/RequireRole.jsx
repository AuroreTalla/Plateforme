import { useContext } from "react";
import { AuthContext } from "../Composants/Authentification/AuthContext";
import { Navigate } from "react-router-dom";

export function RequireRole({ children, allowedRoles }) {
  const { currentUser } = useContext(AuthContext);

  // À ce stade, ProtectedRoute a déjà garanti que currentUser existe
  if (!allowedRoles.includes(currentUser.statut)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}