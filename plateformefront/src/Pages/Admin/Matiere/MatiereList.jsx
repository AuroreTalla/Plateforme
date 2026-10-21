import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, InputAdornment, CircularProgress } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useMatieres } from '../../../Composants/Matiere/MatiereProvider.jsx';
import PageHeader from '../../../Composants/UI/PageHeader';

export default function MatiereList() {
  const navigate = useNavigate();
  const { matieres, loading } = useMatieres();
  const [search, setSearch] = useState('');

  const filtered = matieres.filter((m) => m.nom.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#8b5cf6' }} /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <PageHeader
        titre="Gestion des matières"
        sous="Créez et organisez les enseignements disponibles sur la plateforme."
        action={
          <Button variant="contained" startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/matieres/create')}
            sx={{ textTransform: 'none', borderRadius: 3, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
            Nouvelle matière
          </Button>
        } />

      <TextField fullWidth placeholder="Rechercher une matière..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        sx={{ mb: 3, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

      {filtered.length === 0 ? (
        <Typography color="text.secondary">Aucune matière trouvée.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((m) => (
            <Grid key={m.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%',
                display: 'flex', flexDirection: 'column', '&:hover': { borderColor: '#c4b5fd' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, color: '#fff', flexShrink: 0,
                    background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MenuBookIcon />
                  </Box>
                  <Typography fontWeight="bold" sx={{ color: '#4c1d95' }}>{m.nom}</Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ flex: 1, mb: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {m.description || 'Aucune description.'}
                </Typography>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
                  {m.nbCours} cours · {m.nbExercices} exercices
                </Typography>

                <Button fullWidth variant="outlined" onClick={() => navigate(`/dashboard/matiere/${m.id}/cours`)}
                  sx={{ textTransform: 'none', borderRadius: 2, color: '#7c3aed', borderColor: '#c4b5fd' }}>
                  Gérer le contenu
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}