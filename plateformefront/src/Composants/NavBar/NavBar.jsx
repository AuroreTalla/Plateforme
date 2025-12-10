import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

function NavBar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group ml-2"
            onClick={() => navigate("/")}
          >
            <SchoolIcon 
              className="text-purple-600 group-hover:text-purple-700 transition-colors" 
              style={{ fontSize: 40 }} 
            />
            <span className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
              Plateforme
            </span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => navigate("/courses")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Cours
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              À propos
            </button>
            <button 
              onClick={() => navigate("/contact")}
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Boutons Connexion/Inscription Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate("/connexion")}
              className="px-6 py-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate("/inscription")}
              className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              S'inscrire
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-purple-600 transition-colors"
          >
            {mobileMenuOpen ? (
              <CloseIcon style={{ fontSize: 32 }} />
            ) : (
              <MenuIcon style={{ fontSize: 32 }} />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4">
            <button 
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              Accueil
            </button>
            <button 
              onClick={() => {
                navigate("/courses");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              Cours
            </button>
            <button 
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              À propos
            </button>
            <button 
              onClick={() => {
                navigate("/contact");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
            >
              Contact
            </button>
            <div className="pt-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/connexion");
                  setMobileMenuOpen(false);
                }}
                className="block w-full px-4 py-3 text-center text-purple-600 font-semibold border-2 border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  navigate("/inscription");
                  setMobileMenuOpen(false);
                }}
                className="block w-full px-4 py-3 text-center bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;