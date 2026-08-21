import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../Authentification/AuthContext";
import SideBar from "../SideBar/SideBar.jsx";
import { GroupesProvider } from "../Groupe/GroupProvider.jsx";
import { MatiereProvider } from "../Matiere/MatiereProvider.jsx";

export default function DashboardLayout() {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  if (!currentUser) return null;

  return (
<<<<<<< HEAD
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} user={currentUser} />

      {/* Contenu principal */}
      <main
        className={`
          flex-1 bg-gray-50 overflow-hidden transition-all duration-300
          ${isOpen ? "lg:ml-80" : "lg:ml-20"}
        `}
      >
        {/* IMPORTANT : pas de padding ici */}
        <div className="h-full flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
=======
    <GroupesProvider>
      <MatiereProvider>
      <div className="flex h-full min-h-0">
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} user={currentUser} />

        <main className="flex-1 min-h-0 bg-gray-50 overflow-y-auto transition-all duration-300">
          <div className="h-full flex flex-col p-6">
            <Outlet />
          </div>
        </main>
      </div>
      </MatiereProvider>
    </GroupesProvider>
  );
}
>>>>>>> origin/main
