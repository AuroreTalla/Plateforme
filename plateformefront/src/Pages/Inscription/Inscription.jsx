import { useState, useContext } from "react";
import { Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { inscription, userExists } from "../../ConfigBackEnd/UserService";
import { AuthContext } from "./AuthContext";

function Inscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultEmail = location.state?.email || "";
  const { setCurrentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const exists = await userExists(email);
      if (exists.data) {
        setError("Cet email est déjà utilisé");
        return;
      }

      await inscription(name, email, password, statut);
      setCurrentUser({ name, email });
      navigate("/activationcode", { state: { email, name }, replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" textAlign="center">Créer un compte</Typography>
      {error && <Typography color="error" textAlign="center">{error}</Typography>}

      <TextField label="Nom" value={name} onChange={e => setName(e.target.value)} required fullWidth />
      <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />

      <FormControl variant="outlined" fullWidth>
        <InputLabel>Mot de passe</InputLabel>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={toggleShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Mot de passe"
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Statut</InputLabel>
        <Select value={statut} onChange={e => setStatut(e.target.value)} required>
          <MenuItem value="PROFESSEUR">Professeur</MenuItem>
          <MenuItem value="ELEVE">Élève</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Enregistrer"}
      </Button>
    </Box>
  );
}

export default Inscription;
