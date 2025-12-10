import { createContext } from "react";

export const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false,
  loading: true,
  login: async () => {},  // ✅ Ajouté
  logout: () => {},
});