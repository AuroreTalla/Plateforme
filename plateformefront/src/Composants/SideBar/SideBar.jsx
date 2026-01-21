import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SideBarItems } from "./SideBarItems";

import {
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  ExpandLess,

} from "@mui/icons-material";


export default function SideBar({ isOpen, setIsOpen, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Configuration des menus selon le rôle  
  const items = SideBarItems[user?.statut] || [];

  // ✅ Optimisation : Calcul initial pour éviter un double rendu
  const [expanded, setExpanded] = useState(() => {
    const initialState = {};
    items.forEach((item) => {
      if (item.hasSubMenu && item.subItems.some((s) => pathname.startsWith(s.path))) {
        initialState[item.id] = true;
      }
    });
    return initialState;
  });

  // Mise à jour lors de la navigation
  useEffect(() => {
    items.forEach((item) => {
      if (item.hasSubMenu) {
        const isChildActive = item.subItems.some((s) => pathname.startsWith(s.path));
        // Ouvrir si on navigue dans une sous-rubrique (sans fermer les autres)
        if (isChildActive) {
          setExpanded((prev) => {
            // Uniquement si pas déjà ouvert
            if (prev[item.id]) return prev;
            return { ...prev, [item.id]: true };
          });
        }
      }
    });
  }, [pathname, items]);

  const toggleSubMenu = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const colorClasses = {
    default: "text-gray-700 hover:bg-violet-50 hover:text-violet-700",
  };

  const activeClasses = "bg-violet-600 text-white shadow-md";


  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      <aside
        className={`
          fixed top-20 left-0 bg-white shadow-2xl border-r border-gray-200
          transition-all duration-300 z-40 h-[calc(100vh-80px)] flex flex-col
          ${isOpen ? "w-80" : "w-0 lg:w-20"}
          overflow-hidden
        `}
      >

        <div className="border-b border-gray-200 p-4">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name || "Utilisateur"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                  {user?.statut === "PROFESSEUR" ? "Professeur" : user?.statut === "ADMIN" ? "Admin" : "Élève"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 pt-4 px-3 pb-4 overflow-y-auto space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            const isChildActive = item.hasSubMenu
              ? item.subItems.some((s) => pathname === s.path)
              : false;

            if (item.hasSubMenu) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleSubMenu(item.id)}
                    className={`
                      w-full flex items-center px-3 py-3 rounded-xl transition-all
                      ${isChildActive ? activeClasses : colorClasses.default}
                      ${!isOpen && "lg:justify-center"}
                    `}
                  >

                    <div className={`min-w-[40px] flex justify-center ${!isOpen && "lg:min-w-0"}`}>
                      <Icon />
                    </div>
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left font-medium text-sm">{item.text}</span>
                        {expanded[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </>
                    )}
                  </button>

                  {isOpen && expanded[item.id] && (
                    <div className="ml-6 mt-2 pl-4 space-y-1 border-l-2 border-violet-500">
                      {item.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => navigate(sub.path)}
                            className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                            ${pathname === sub.path
                                ? "bg-violet-100 text-violet-700 font-semibold"
                                : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                              }
                          `}
                          >
                            <SubIcon fontSize="small" className="opacity-80" />
                            <span>{sub.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${isActive ? activeClasses : colorClasses.default}
                  ${!isOpen && "lg:justify-center"}
                `}
              >

                <div className={`min-w-[40px] flex justify-center ${!isOpen && "lg:min-w-0"}`}>
                  <Icon />
                </div>
                {isOpen && <span className="font-medium text-sm">{item.text}</span>}
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:flex justify-center p-3 border-t border-gray-200">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 transition"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
      </aside>
    </>
  );
}