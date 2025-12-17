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
    setSuccessMessage("");
    setLoading(true);

    try {
      // Vérifier si l'utilisateur existe déjà
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

      // ✅ Créer le compte
      const response = await inscription(name, email, password, statut);
      
      // ✅ Si demande professeur
      if (response.data.demandeProfesseur) {
        setSuccessMessage(
          "Compte créé avec succès ! Votre demande de statut professeur a été envoyée à l'administrateur. " +
          "Vous recevrez une notification par email une fois votre demande traitée. " +
          "En attendant, vous pouvez vous connecter avec un accès élève."
        );
        
        // Rediriger après 5 secondes
        setTimeout(() => {
          navigate("/activationcode", { 
            state: { email, name, demandeProfesseur: true }, 
            replace: true 
          });
        }, 5000);
      } else {
        // ✅ Inscription élève normale
        navigate("/activationcode", { 
          state: { email, name }, 
          replace: true 
        });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Inscription
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="login-label-design">Nom complet</label>
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
            <label className="login-label-design">Email</label>
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
            <label className="login-label-design">Mot de passe</label>
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {/* Statut */}
          <div className="relative h-14">
            <WorkIcon className="login-icon-design" />
            <select
              name="statut"
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              required
              className="peer login-input-design appearance-none cursor-pointer"
            >
              <option value="" disabled></option>
              <option value="ELEVE">Élève</option>
              <option value="PROFESSEUR">Professeur</option>
            </select>
            <label className={`login-label-design ${statut ? 'top-0 left-3 text-[12px] text-blue-800 bg-white px-2' : ''} peer-focus:top-0 peer-focus:left-3 peer-focus:text-[12px] peer-focus:text-blue-800 peer-focus:bg-white peer-focus:px-2`}>
              Je suis...
            </label>
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Vous avez déjà un compte ?{" "}
          <button
            onClick={() => navigate("/connexion")}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}

export default Inscription;