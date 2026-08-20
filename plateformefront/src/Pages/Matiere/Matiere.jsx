import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, ButtonGroup, Button, Chip, CircularProgress, Typography, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { getMatiereById, getCoursByMatiere, getExercicesByMatiere } from '../../ConfigBackEnd/MatiereService';

function MatierePage({ defaultTab = 'cours' }) {
  const { matiereId, tab } = useParams();
  const active = tab || defaultTab;

  const [matiere, setMatiere] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [matiereRes, itemsRes] = await Promise.all([
          getMatiereById(matiereId),
          active === 'cours' ? getCoursByMatiere(matiereId) : getExercicesByMatiere(matiereId)
        ]);
        if (mounted) {
          setMatiere(matiereRes.data);
          setItems(itemsRes.data);
          setSelected(itemsRes.data[0] || null);
        }
      } catch (e) {
        console.error('❌ Erreur chargement matière :', e);
        if (mounted) {
          setError(e.response?.status === 404 ? "Cette matière n'existe plus." : "Erreur lors du chargement.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [matiereId, active]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#8b5cf6' }} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="text.secondary" sx={{ p: 3 }}>{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 3 }}>
        {matiere.nom}
      </Typography>

      {items.length === 0 ? (
        <Typography color="text.secondary">Aucun contenu pour l'instant.</Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Paper elevation={1} sx={{ width: 260, flexShrink: 0, borderRadius: 3 }}>
            <List>
              {items.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={selected?.id === item.id}
                  onClick={() => setSelected(item)}
                >
                  <ListItemText primary={item.titre} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Paper elevation={1} sx={{ flex: 1, p: 3, borderRadius: 3 }}>
            {selected ? (
              <>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>{selected.titre}</Typography>
                {selected.type === 'TEXTE' && (
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selected.contenu}</Typography>
                )}
                {selected.type === 'IMAGE' && (
                  <Box component="img" src={selected.mediaUrl} sx={{ maxWidth: '100%', borderRadius: 2 }} />
                )}
                {selected.type === 'VIDEO' && (
                  <Box component="video" src={selected.mediaUrl} controls sx={{ maxWidth: '100%', borderRadius: 2 }} />
                )}
              </>
            ) : (
              <Typography color="text.secondary">Sélectionnez un élément.</Typography>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default MatierePage;