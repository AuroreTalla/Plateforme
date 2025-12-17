import { useContext } from "react";
import { AuthContext } from "../Composants/Authentification/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
      import LoadingPage from "../Composants/LoadingPage.jsx";


export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);
  

if (loading) {
  return <LoadingPage />;
}

  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children || <Outlet />;
}