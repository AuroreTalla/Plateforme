import { useContext } from "react";
import { AuthContext } from "../Composants/Authentification/AuthContext";

/**
 * Centralise les vérifications de rôle de l'utilisateur courant.
 * Évite de réécrire `currentUser?.statut === 'ADMIN'` partout.
 */
export function useRole() {
  const { currentUser } = useContext(AuthContext);

  const statut = currentUser?.statut ?? null;

  return {
    statut,
    isEleve: statut === "ELEVE",
    isProfesseur: statut === "PROFESSEUR",
    isAdmin: statut === "ADMIN",
    isProfOuAdmin: statut === "PROFESSEUR" || statut === "ADMIN",
    hasRole: (...roles) => roles.includes(statut),
  };
}