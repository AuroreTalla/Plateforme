import { Navigate } from "react-router-dom";
import { useRole } from "../hooks/useRole";

export function RequireRole({ children, allowedRoles }) {
  const { hasRole } = useRole();

  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}