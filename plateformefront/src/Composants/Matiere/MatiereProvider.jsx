import { createContext, useContext } from "react";
import { getAllMatieres } from "../../Services/MatiereService";
import { useFetchedResource } from "../../hooks/useFetchedResource";

const MatiereContext = createContext({ matieres: [], loading: true });

export function MatiereProvider({ children }) {
  const { data: matieres, loading, refetch } = useFetchedResource(getAllMatieres, []);

  return (
    <MatiereContext.Provider value={{ matieres, loading, refetch }}>
      {children}
    </MatiereContext.Provider>
  );
}

export const useMatieres = () => useContext(MatiereContext);