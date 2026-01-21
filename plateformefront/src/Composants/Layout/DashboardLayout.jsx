
import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../Authentification/AuthContext";
import SideBar from "../SideBar/SideBar.jsx";

export default function DashboardLayout() {
  const { currentUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} user={currentUser} />

      {/* Contenu Principal */}
      <main 
        className={`
          flex-1 bg-gray-50 overflow-auto transition-all duration-300 mt-20
          ${isOpen ? "lg:ml-80" : "lg:ml-20"}
        `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

