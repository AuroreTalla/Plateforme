import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { reinitialiserMotDePasse } from '../../ConfigBackEnd/UserService';

function ReinitialiserMotDePasse() {
  const navigate = useNavigate();
  const location = useLocation();

  const [code, setCode] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmMdp, setConfirmMdp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (nouveauMdp !== confirmMdp) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await reinitialiserMotDePasse(code, nouveauMdp);
      navigate('/connexion', { state: { message: 'Mot de passe réinitialisé, connectez-vous.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5faf7] p-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Typography variant="h4" fontWeight="bold" color="#1e293b">Réinitialiser le mot de passe</Typography>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Code reçu par email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Nouveau mot de passe"
            value={nouveauMdp}
            onChange={(e) => setNouveauMdp(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmer le mot de passe"
            value={confirmMdp}
            onChange={(e) => setConfirmMdp(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Réinitialiser'}
          </Button>
        </Box>
      </div>
    </div>
  );
}

export default ReinitialiserMotDePasse;