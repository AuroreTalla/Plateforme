import { useState, useContext } from "react";
import { Box, Typography, Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Composants/NavBar/NavBar.jsx";
import imgAccueil from "../../assets/img.jpg";
import { loginUser } from "../../ConfigBackEnd/UserService";
import { AuthContext } from "../Inscription/AuthContext";

function PageAccueil() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCommencer = async () => {
    setError("");
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email invalide");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(email, password);
      
      // ✅ Si le backend renvoie un utilisateur
      if (res?.data?.user) {
        setCurrentUser(res.data.user);
        
        // ✅ Marquer que l'utilisateur s'est connecté
        localStorage.setItem("isAuthenticated", "true");
        
        navigate("/dashboard", { replace: true });
      } else {
        setError("Identifiants incorrects");
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Échec de la connexion";
      
      if (status === 401) {
        setError(message);
      } else if (status === 404) {
        navigate("/inscription", { replace: true });
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-around"
      p={4}
      minHeight="80vh"
    >
      <NavBar />
      <Box
        textAlign={{ xs: "center", md: "left" }}
        maxWidth={500}
        mb={{ xs: 4, md: 0 }}
      >
        <Typography variant="h3" gutterBottom>
          Bienvenue sur la plateforme
        </Typography>
        <Typography variant="body1" mb={3}>
          Connectez-vous ou créez un compte pour continuer.
        </Typography>

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="dense"
        />
        
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="dense"
          onKeyPress={(e) => {
            if (e.key === "Enter") handleCommencer();
          }}
        />

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={handleCommencer}
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Commencer"
          )}
        </Button>
      </Box>

      <Box>
        <img
          src={imgAccueil}
          alt="Accueil"
          style={{ maxWidth: "100%", borderRadius: 8 }}
        />
      </Box>
    </Box>
  );
}

export default PageAccueil;