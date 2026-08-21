import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { demanderReinitialisation } from '../../ConfigBackEnd/UserService';

function MotDePasseOublie() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await demanderReinitialisation(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5faf7] p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Typography variant="h4" fontWeight="bold" color="#1e293b">Mot de passe oublié</Typography>

        {sent ? (
          <>
            <Alert severity="success">
              Si cet email existe, un code de réinitialisation vient d'être envoyé.
            </Alert>
            <Button fullWidth variant="contained" onClick={() => navigate('/reinitialiser-mot-de-passe', { state: { email } })}>
              J'ai reçu mon code
            </Button>
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.5 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Envoyer le code'}
            </Button>
          </Box>
        )}
      </div>
    </div>
  );
}

export default MotDePasseOublie;