import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { loginUser } from "../../ConfigBackEnd/UserService";
import { AuthContext } from "../../Composants/Authentification/AuthContext";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import img from "../../assets/img1.jpeg"

function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const defaultEmail = location.state?.email || "";
  const messageFromNavigation = location.state?.message || "";

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState(messageFromNavigation);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setLoading(true);

    try {
      const response = await login(email, password);
      // ✅ Sauvegarder l'utilisateur dans le contexte
      if (!response.success) {
      setError(response.error);
      return;
    }
      navigate("/dashboard", { replace: true });
    
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.status === 403) {
        setError("Compte non activé. Vérifiez vos emails pour le code d'activation");
      } else {
        setError(err.response?.data?.message || "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5faf7] overflow-hidden">

      <div className="flex w-full max-w-[1100px] h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Section Image - 40% */}
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat relative hidden lg:block"
          style={{
            //backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800')"
            backgroundImage: `url(${img})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-purple-600/30"></div>

          {/* Texte sur l'image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
            <SchoolIcon style={{ fontSize: 100, marginBottom: 24 }} />
            <h2 className="text-4xl font-bold mb-4">Plateforme</h2>
            <p className="text-xl text-center max-w-md">
              Apprenez, enseignez et grandissez ensemble
            </p>
          </div>
        </div>

        {/* Section Formulaire - 60% */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-white overflow-hidden">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Connexion</h1>
            <p className="text-gray-600">Bon retour parmi nous !</p>
          </div>

          {/* Messages */}
          {infoMessage && (
            <div className="w-full max-w-md mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="w-full max-w-md mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email avec peer */}
              <div className="relative h-14">
                <AlternateEmailIcon className="login-icon-design" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="peer login-input-design"
                  placeholder=" "
                />
                <label className="login-label-design peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2 peer-valid:top-0 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-blue-800 peer-valid:bg-white peer-valid:px-2">
                  Email
                </label>
              </div>

              {/* Mot de passe avec peer */}
              <div className="relative h-14">
                <LockIcon className="login-icon-design" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer login-input-design pr-12"
                  placeholder=" "
                />
                <label className="login-label-design peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2 peer-valid:top-0 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-blue-800 peer-valid:bg-white peer-valid:px-2">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-800 transition-colors z-10"
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </button>
              </div>

              {/* Mot de passe oublié */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/mot-de-passe-oublie")}
                  className="text-blue-800 text-sm hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton de soumission - CENTRÉ */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="login-button-design"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </div>
            </form>

            {/* Lien inscription */}
            <p className="text-center text-gray-600 mt-8 text-sm">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/inscription")}
                className="text-blue-800 hover:underline font-semibold"
              >
                S'inscrire
              </button>
            </p>

            {/* Retour à l'accueil */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-800 hover:underline mt-4 text-sm"
              >
                ← Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Connexion;