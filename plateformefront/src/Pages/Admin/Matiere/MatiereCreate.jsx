import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { creerMatiere } from '../../../Services/MatiereService';
import { useMatieres } from '../../../Composants/Matiere/MatiereProvider.jsx';
import PageHeader from '../../../Composants/UI/PageHeader';

export default function MatiereCreate() {
  const navigate = useNavigate();
  const { refetch } = useMatieres();
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await creerMatiere(nom.trim(), description.trim());
      await refetch();                       // met à jour sidebar et dashboards
      navigate('/dashboard/matieres/list');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <PageHeader titre="Nouvelle matière"
        sous="La création génère aussi le forum de discussion associé." />

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Nom de la matière</Typography>
          <TextField fullWidth required value={nom} onChange={(e) => setNom(e.target.value)}
            placeholder="Ex : Intelligence artificielle" sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Description</Typography>
          <TextField fullWidth multiline rows={5} value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez les objectifs pédagogiques..."
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading || !nom.trim()}
              sx={{ textTransform: 'none', borderRadius: 999, px: 4, py: 1.2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Créer la matière'}
            </Button>
            <Button onClick={() => navigate('/dashboard/matieres/list')} disabled={loading}
              sx={{ textTransform: 'none', borderRadius: 999, px: 4, bgcolor: '#ede9fe', color: '#7c3aed', '&:hover': { bgcolor: '#ddd6fe' } }}>
              Annuler
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}