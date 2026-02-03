import { useState, useContext } from "react";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { activationUser } from "../../ConfigBackEnd/UserService";
import { AuthContext } from "../../Composants/Authentification/AuthContext";

function ActivationCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, refreshUser } = useContext(AuthContext);  // ✅ Ajout refreshUser

  const email = location.state?.email || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivation = async () => {
    if (!code.trim()) {
      setError("Veuillez saisir le code d'activation.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Activation du compte
      const res = await activationUser(email, code);

      // ✅ Le backend retourne l'utilisateur complet après activation
      if (res.data) {
        setCurrentUser(res.data);  // Sauvegarde automatique via updateUser
        navigate("/dashboard", { replace: true });
      } else {
        // ✅ Fallback : récupérer depuis le backend
        await refreshUser();
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5faf7] p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Activation de compte</h1>
          <p className="text-gray-600">
            Un code a été envoyé à : <br />
            <strong className="text-purple-600">{email}</strong>
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {/* Champ de saisie du code */}
        <div className="space-y-4">
          <TextField
            fullWidth
            label="Code d'activation"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            inputProps={{ maxLength: 6 }}
            variant="outlined"
            placeholder="Entrez le code à 6 chiffres"
          />
        </div>

        {/* Bouton de validation */}
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

        {/* Lien retour */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-purple-600 hover:underline text-sm"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivationCode;