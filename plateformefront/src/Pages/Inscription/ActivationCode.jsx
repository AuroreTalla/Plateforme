import { useState, useContext } from "react";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { activationUser, getUserByEmail } from "../../ConfigBackEnd/UserService";
import { AuthContext } from "./AuthContext";

function ActivationCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useContext(AuthContext);
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
      await activationUser(email, code);
      const res = await getUserByEmail(email);
      setCurrentUser(res.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" maxWidth={400} mx="auto" mt={5} gap={2}>
      <Typography variant="h5" textAlign="center">Activation de compte</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField label="Code d'activation" value={code} onChange={e => setCode(e.target.value)} required />
      <Button onClick={handleActivation} disabled={loading} variant="contained">
        {loading ? <CircularProgress size={24} color="inherit" /> : "Valider"}
      </Button>
    </Box>
  );
}

export default ActivationCode;
