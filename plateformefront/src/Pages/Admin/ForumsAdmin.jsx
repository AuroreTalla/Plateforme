import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, IconButton, InputAdornment, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicationList from '../Forum/PublicationList';
import PageHeader from '../../Composants/UI/PageHeader';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';
import { supprimerMatiere } from '../../Services/MatiereService.js';
import { connectWebSocket, disconnectWebSocket } from '../../Services/WebSocketConfig.js';

export default function ForumsAdmin() {
  const { matieres, loading, refetch } = useMatieres();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);        // matière dont on ouvre le forum
  const [aSupprimer, setASupprimer] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  // La connexion WebSocket n'est nécessaire que lorsqu'un forum est ouvert
  useEffect(() => {
    if (!selected) return;
    connectWebSocket(() => setWsConnected(true), () => setWsConnected(false));
    return () => { disconnectWebSocket(); setWsConnected(false); };
  }, [selected]);

  const confirmerSuppression = async () => {
    setDeleting(true);
    setError(null);
    try {
      await supprimerMatiere(aSupprimer.id);
      await refetch();
      setASupprimer(null);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de la suppression.');
      setASupprimer(null);
    } finally {
      setDeleting(false);
    }
  };

  if (selected) {
    return (
      <Box sx={{ height: '100%' }}>
        <PublicationList groupeId={selected.groupeId} wsConnected={wsConnected}
          onBack={() => setSelected(null)} />
      </Box>
    );
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>;
  }

  const filtered = matieres.filter((m) => m.nom.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <PageHeader titre="Administration des forums"
        sous="Supervision et modération de tous les espaces de discussion." />

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <TextField fullWidth placeholder="Rechercher un forum..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        sx={{ mb: 3, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />

      {filtered.length === 0 ? (
        <Typography color="text.secondary">Aucun forum trouvé.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((m) => (
            <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%',
                '&:hover': { borderColor: '#c4b5fd' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#f5f3ff', color: '#7c3aed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ForumIcon />
                  </Box>
                  <Typography fontWeight="bold" sx={{ color: '#4c1d95' }}>{m.nom}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {m.description || 'Aucune description.'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                  <Button size="small" onClick={() => setSelected(m)}
                    sx={{ textTransform: 'none', fontWeight: 600, color: '#7c3aed' }}>
                    Ouvrir le forum
                  </Button>
                  <IconButton size="small" onClick={() => setASupprimer(m)} sx={{ color: '#ef4444' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={!!aSupprimer} onClose={() => !deleting && setASupprimer(null)}
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle>Supprimer cette matière ?</DialogTitle>
        <DialogContent>
          <Typography>
            Ceci supprimera <strong>{aSupprimer?.nom}</strong>, son forum, ses cours et ses exercices.
            Si le forum contient des publications, la suppression sera refusée.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setASupprimer(null)} disabled={deleting}>Annuler</Button>
          <Button onClick={confirmerSuppression} disabled={deleting} color="error" variant="contained">
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}