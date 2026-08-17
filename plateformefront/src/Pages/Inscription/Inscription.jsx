import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { inscription, userExists } from "../../ConfigBackEnd/UserService";
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


function Inscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || "";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const exists = await userExists(email);
    if (exists.data) {
      setError("Cet email est déjà inscrit. Redirection vers la connexion...");
      setTimeout(() => {
        navigate("/connexion", {
          state: {
            email,
            message: "Vous avez déjà un compte, veuillez vous connecter"
          }
        });
      }, 2000);
      return;
    }

    const response = await inscription(name, email, password, statut);

    // Pas de message ici : la demande professeur n'est pas encore confirmée,
    // le compte n'est même pas encore activé. On informe seulement après activation.
    navigate("/activationcode", {
      state: {
        email,
        name,
        demandeProfesseur: response.data.demandeProfesseur
      },
      replace: true
    });

  } catch (err) {
    setError(err.response?.data?.message || "Erreur lors de l'inscription");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5faf7] overflow-hidden">

      <div className="flex w-full max-w-[1100px] h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Section Image - 40% */}
        <div 
          className="w-1/2 bg-cover bg-center bg-no-repeat relative hidden lg:block"
          style={{
            //backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800')"
            backgroundImage: "url('/assets/img1.jpeg')"
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
        
        <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Inscription</h1>
            <p className="text-gray-600">Bienvenu parmi nous !</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {/* Formulaire */}
        <div className="w-full max-w-md">
          <div className="space-y-6">

          {/* Nom */}
          <div className="relative h-14">
            <PersonIcon className="login-icon-design" />
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="peer login-input-design"
            />
            <label className="login-label-design peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2 peer-valid:top-0 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-blue-800 peer-valid:bg-white peer-valid:px-2">
                  Nom
            </label>
          </div>

          {/* Email */}
          <div className="relative h-14">
            <AlternateEmailIcon className="login-icon-design" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer login-input-design"
            />
            <label className="login-label-design peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2 peer-valid:top-0 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-blue-800 peer-valid:bg-white peer-valid:px-2">
                  Email
            </label>
          </div>

          {/* Mot de passe */}
          <div className="relative h-14">
            <LockIcon className="login-icon-design" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="peer login-input-design"
            />
            <label className="login-label-design peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2 peer-valid:top-0 peer-valid:left-3 peer-valid:text-[12px] peer-valid:text-blue-800 peer-valid:bg-white peer-valid:px-2">
                  Mot de passe
            </label>

            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
              ) : (
                    <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>

          {/* Statut */}
          <div className="relative h-14 w-full">
            {/* Icône à gauche */}
            <WorkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none" />

            {/* Select */}
            <select
              name="statut"
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              required
              className="peer login-input-design appearance-none cursor-pointer"
            >
              <option value="" disabled hidden></option>
              <option value="ELEVE">Élève</option>
              <option value="PROFESSEUR">Professeur</option>
            </select>

            {/* Label flottant */}
            <label
              className={`
                login-label-design
                peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px]
                peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2
                peer-valid:top-0 peer-valid:left-3 peer-valid:text-[12px]
                peer-valid:text-blue-800 peer-valid:bg-white peer-valid:px-2
                ${statut ? 'top-0 left-3 text-[12px] text-blue-800 bg-white px-2' : ''}
              `}
            >
              Je suis...
            </label>

            {/* Chevron */}
            <ArrowDropDownIcon
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-[26px] pointer-events-none"
            />
          </div>


          {/* ✅ Message d'information pour les professeurs */}
          {statut === "PROFESSEUR" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <InfoIcon className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Votre demande de statut professeur sera examinée par un administrateur. 
                Vous recevrez un email une fois votre demande validée.
              </p>
            </div>
          )}

          {/* Bouton Submit */}
          <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="login-button-design"
          >
            {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Inscription...
                    </span>
                  ) : (
                    "S'inscrire"
                  )}
          </button>
        </div>
      </div>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Vous avez déjà un compte ?{" "}
          <button
            onClick={() => navigate("/connexion")}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Se connecter
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

export default Inscription;