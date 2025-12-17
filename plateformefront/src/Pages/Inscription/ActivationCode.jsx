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
    <Box display="flex" flexDirection="column" maxWidth={400} mx="auto" mt={5} gap={2}>
      <Typography variant="h5" textAlign="center">
        Activation de compte
      </Typography>
      
      <Typography variant="body2" textAlign="center" color="text.secondary">
        Un code a été envoyé à : <strong>{email}</strong>
      </Typography>
      
      {error && <Typography color="error">{error}</Typography>}
      
      <TextField
        label="Code d'activation"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="123456"
        required
        inputProps={{ maxLength: 6 }}
      />
      
      <Button onClick={handleActivation} disabled={loading} variant="contained">
        {loading ? <CircularProgress size={24} color="inherit" /> : "Valider"}
      </Button>
    </Box>
  );
}

export default ActivationCode;