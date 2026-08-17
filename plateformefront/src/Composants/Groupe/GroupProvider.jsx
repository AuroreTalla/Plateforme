import { createContext, useContext, useEffect, useState } from "react";
import { getAllGroupes } from "../../ConfigBackEnd/GroupService";
import { GroupContext } from "./GroupContext";

export function GroupesProvider({ children }) {
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGroupes = async () => {
      try {
        setLoading(true);
        const res = await getAllGroupes();
          console.log("📦 Réponse brute getAllGroupes :", res.data);
        if (mounted) setGroupes(res.data);
      } catch (error) {
        console.error("❌ Erreur récupération groupes :", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadGroupes();
    return () => { mounted = false; };
  }, []);

  return (
    <GroupContext.Provider value={{ groupes, loading }}>
      {children}
    </GroupContext.Provider>
  );
}

export const useGroupes = () => useContext(GroupContext);