import { createContext, useContext } from "react";
import { getAllGroupes } from "../../Services/GroupService";
import { useFetchedResource } from "../../hooks/useFetchedResource";

const GroupContext = createContext({ groupes: [], loading: true });

export function GroupesProvider({ children }) {
  const { data: groupes, loading, refetch } = useFetchedResource(getAllGroupes, []);

  return (
    <GroupContext.Provider value={{ groupes, loading, refetch }}>
      {children}
    </GroupContext.Provider>
  );
}

export const useGroupes = () => useContext(GroupContext);