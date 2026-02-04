import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../Authentification/AuthContext";
import SideBar from "../SideBar/SideBar.jsx";

export default function DashboardLayout() {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  if (!currentUser) return null;

  return (
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
