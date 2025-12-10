import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquare,
  MessageCircle,
  Calculator,
  FlaskConical,
  Atom,
  UserCircle,
  LogOut,
  Plus,
  List
} from "lucide-react";

export default function SideBar({ isOpen, setIsOpen, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Configuration des menus selon le rôle
  const menuItems = {
    eleve: [
      { 
        id: "dashboard", 
        icon: LayoutDashboard, 
        text: "Dashboard", 
        path: "/dashboard",
        color: "blue"
      },
      {
        id: "cours",
        icon: BookOpen,
        text: "Cours",
        color: "green",
        hasSubMenu: true,
        subItems: [
          { id: "mathC", icon: Calculator, text: "Mathématiques", path: "/cours/maths" },
          { id: "physC", icon: FlaskConical, text: "Physique", path: "/cours/physique" },
          { id: "chimC", icon: Atom, text: "Chimie", path: "/cours/chimie" },
        ],
      },
      {
        id: "exo",
        icon: FileText,
        text: "Exercices",
        color: "orange",
        hasSubMenu: true,
        subItems: [
          { id: "mathE", icon: Calculator, text: "Mathématiques", path: "/exo/maths" },
          { id: "physE", icon: FlaskConical, text: "Physique", path: "/exo/physique" },
          { id: "chimE", icon: Atom, text: "Chimie", path: "/exo/chimie" },
        ],
      },
      { 
        id: "forum", 
        icon: MessageSquare, 
        text: "Forum", 
        path: "/forum",
        color: "purple"
      },
      { 
        id: "feedback", 
        icon: MessageCircle, 
        text: "Feedback", 
        path: "/feedback",
        color: "pink"
      },
    ],

    prof: [
      { 
        id: "dashboard", 
        icon: LayoutDashboard, 
        text: "Dashboard", 
        path: "/dashboard",
        color: "blue"
      },
      {
        id: "cours",
        icon: BookOpen,
        text: "Cours",
        color: "green",
        hasSubMenu: true,
        subItems: [
          { id: "mathC", icon: Calculator, text: "Mathématiques", path: "/cours/maths" },
          { id: "physC", icon: FlaskConical, text: "Physique", path: "/cours/physique" },
          { id: "chimC", icon: Atom, text: "Chimie", path: "/cours/chimie" },
        ],
      },
      {
        id: "exo",
        icon: FileText,
        text: "Exercices",
        color: "orange",
        hasSubMenu: true,
        subItems: [
          { id: "mathE", icon: Calculator, text: "Mathématiques", path: "/exo/maths" },
          { id: "physE", icon: FlaskConical, text: "Physique", path: "/exo/physique" },
          { id: "chimE", icon: Atom, text: "Chimie", path: "/exo/chimie" },
        ],
      },
      {
        id: "forum",
        icon: MessageSquare,
        text: "Forum",
        color: "purple",
        hasSubMenu: true,
        subItems: [
          { id: "list", icon: List, text: "Liste des groupes", path: "/forum/list" },
          { id: "add", icon: Plus, text: "Créer un groupe", path: "/forum/create" },
        ],
      },
      { 
        id: "feedback", 
        icon: MessageCircle, 
        text: "Feedback", 
        path: "/feedback",
        color: "pink"
      },
    ],

    admin: [
      { 
        id: "dashboard", 
        icon: LayoutDashboard, 
        text: "Dashboard", 
        path: "/dashboard",
        color: "blue"
      },
      {
        id: "users",
        icon: UserCircle,
        text: "Utilisateurs",
        color: "indigo",
        hasSubMenu: true,
        subItems: [
          { id: "listUsers", icon: List, text: "Liste", path: "/users/list" },
          { id: "addUser", icon: Plus, text: "Ajouter", path: "/users/add" },
        ],
      },
      {
        id: "cours",
        icon: BookOpen,
        text: "Gestion Cours",
        color: "green",
        path: "/admin/cours"
      },
      { 
        id: "feedback", 
        icon: MessageCircle, 
        text: "Feedback", 
        path: "/feedback",
        color: "pink"
      },
    ],
  };

  const items = menuItems[user?.role] || [];
  const [expanded, setExpanded] = useState({});

  // Ouvrir automatiquement le sous-menu si une page enfant est active
  useEffect(() => {
    items.forEach((item) => {
      if (item.hasSubMenu) {
        const isChildActive = item.subItems.some((s) => pathname.startsWith(s.path));
        if (isChildActive) {
          setExpanded((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [pathname, items]);

  const toggleSubMenu = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    // Logique de déconnexion
    localStorage.removeItem("token");
    navigate("/login");
  };

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    pink: "bg-pink-100 text-pink-600 hover:bg-pink-200",
    indigo: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
  };

  const activeColorClasses = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    orange: "bg-orange-600 text-white",
    purple: "bg-purple-600 text-white",
    pink: "bg-pink-600 text-white",
    indigo: "bg-indigo-600 text-white",
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      {/* Bouton mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-20 left-0 bg-white shadow-2xl border-r border-gray-200
          transition-all duration-300 z-40 h-[calc(100vh-80px)] flex flex-col
          ${isOpen ? "w-80" : "w-0 lg:w-20"}
          overflow-hidden
        `}
      >
        {/* En-tête utilisateur */}
        <div className="border-b border-gray-200 p-4">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name || "Utilisateur"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                  {user?.role === "prof" ? "Professeur" : user?.role === "admin" ? "Admin" : "Élève"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
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
                      w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200
                      ${isChildActive 
                        ? activeColorClasses[item.color] 
                        : `hover:bg-gray-100 text-gray-700`
                      }
                      ${!isOpen && "lg:justify-center"}
                    `}
                  >
                    <div className={`min-w-[40px] flex justify-center ${!isOpen && "lg:min-w-0"}`}>
                      <Icon size={22} />
                    </div>
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left font-medium text-sm">{item.text}</span>
                        {expanded[item.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </>
                    )}
                  </button>

                  {isOpen && expanded[item.id] && (
                    <div className="ml-6 mt-1 space-y-1 pl-4 border-l-2 border-gray-200">
                      {item.subItems.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => navigate(sub.path)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                              ${pathname === sub.path 
                                ? "bg-purple-600 text-white shadow-md" 
                                : "hover:bg-gray-100 text-gray-600"
                              }
                            `}
                          >
                            <SubIcon size={18} />
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
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? activeColorClasses[item.color] + " shadow-lg"
                    : colorClasses[item.color]
                  }
                  ${!isOpen && "lg:justify-center"}
                `}
                title={!isOpen ? item.text : ""}
              >
                <div className={`min-w-[40px] flex justify-center ${!isOpen && "lg:min-w-0"}`}>
                  <Icon size={22} />
                </div>
                {isOpen && <span className="font-medium text-sm">{item.text}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bouton déconnexion */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
              bg-red-50 text-red-600 hover:bg-red-100
              ${!isOpen && "lg:justify-center"}
            `}
            title={!isOpen ? "Déconnexion" : ""}
          >
            <div className={`min-w-[40px] flex justify-center ${!isOpen && "lg:min-w-0"}`}>
              <LogOut size={22} />
            </div>
            {isOpen && <span className="font-medium text-sm">Déconnexion</span>}
          </button>
        </div>

        {/* Bouton toggle desktop */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 p-2 bg-white text-gray-700 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>
    </>
  );
}