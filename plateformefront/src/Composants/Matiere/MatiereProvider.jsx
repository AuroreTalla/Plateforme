import { createContext, useContext, useEffect, useState } from "react";
import { getAllMatieres } from "../../ConfigBackEnd/MatiereService";

const MatiereContext = createContext({ matieres: [], loading: true });

export function MatiereProvider({ children }) {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllMatieres();
      setMatieres(res.data);
    } catch (e) {
      console.error('❌ Erreur chargement matières :', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <MatiereContext.Provider value={{ matieres, loading, refetch: load }}>
      {children}
    </MatiereContext.Provider>
  );
}

export const useMatieres = () => useContext(MatiereContext);