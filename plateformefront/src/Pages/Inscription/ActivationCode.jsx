import { useState, useContext } from "react";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { activationUser } from "../../ConfigBackEnd/UserService";
import { AuthContext } from "../../Composants/Authentification/AuthContext";

function ActivationCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, refreshUser } = useContext(AuthContext);

  const email = location.state?.email || "";
  const demandeProfesseur = location.state?.demandeProfesseur || false;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activated, setActivated] = useState(false);

  const handleActivation = async () => {
    if (!code.trim()) {
      setError("Veuillez saisir le code d'activation.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await activationUser(email, code);

      if (res.data) {
        setCurrentUser(res.data);
      } else {
        await refreshUser();
      }

      if (demandeProfesseur) {
        // On affiche le message, puis on redirige après un délai
        setActivated(true);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 5000);
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (activated) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5faf7] p-4 md:p-8">
      <div className="w-full max-w-md flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Compte activé avec succès !</h1>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          Votre demande de statut professeur a été envoyée à l'administrateur.
          Vous recevrez une notification par email une fois votre demande traitée.
          En attendant, vous pouvez utiliser la plateforme avec un accès élève.
        </div>
        <p className="text-gray-500 text-sm">Redirection vers votre tableau de bord...</p>
      </div>
    </div>
  );
}

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#f5faf7] p-4 md:p-8">
    <div className="w-full max-w-md flex flex-col items-center gap-6">

      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Activation de compte</h1>
        <p className="text-gray-600">Un code a été envoyé à : <strong>{email}</strong></p>
      </div>

      {error && <Typography color="error">{error}</Typography>}

      <TextField
        fullWidth
        label="Code d'activation"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
        inputProps={{ maxLength: 6 }}
      />

      <button
        type="button"
        onClick={handleActivation}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Activation...
          </span>
        ) : (
          "Valider"
        )}
      </button>

    </div>
  </div>
);
}

export default ActivationCode;