import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, Typography, Paper, IconButton, TextField, InputAdornment, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import { AuthContext } from '../../Composants/Authentification/AuthContext';
import {
  getMatiereById,
  getCoursByMatiere,
  getExercicesByMatiere,
  ajouterCours,
  ajouterExercice,
  supprimerCours,
  supprimerExercice,
  buildMediaUrl,
} from '../../ConfigBackEnd/MatiereService';
import AjoutContenuForm from './AjoutContenuForm';

const typeIcons = {
  TEXTE: ArticleIcon,
  IMAGE: ImageIcon,
  VIDEO: VideocamIcon,
  AUDIO: AudiotrackIcon,
  PDF: PictureAsPdfIcon,
  DOCUMENT: DescriptionIcon,
};

function MatierePage({ defaultTab = 'cours' }) {
  const { matiereId, tab } = useParams();
  const active = tab || defaultTab;
  const { currentUser } = useContext(AuthContext);

  const peutModifier = currentUser?.statut === 'ADMIN' || currentUser?.statut === 'PROFESSEUR';

  const [matiere, setMatiere] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [matiereRes, itemsRes] = await Promise.all([
        getMatiereById(matiereId),
        active === 'cours' ? getCoursByMatiere(matiereId) : getExercicesByMatiere(matiereId)
      ]);
      setMatiere(matiereRes.data);
      setItems(itemsRes.data);
      setSelected(itemsRes.data[0] || null);
    } catch (e) {
      console.error('❌ Erreur chargement matière :', e);
      setError(e.response?.status === 404 ? "Cette matière n'existe plus." : "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }, [matiereId, active]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAjout = async ({ titre, type, contenu, mediaUrl }) => {
    const ajouter = active === 'cours' ? ajouterCours : ajouterExercice;
    await ajouter(matiereId, titre, type, contenu, mediaUrl);
    setShowForm(false);
    await load();
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer ce contenu ?')) return;
    try {
      const supprimer = active === 'cours' ? supprimerCours : supprimerExercice;
      await supprimer(id);
      await load();
    } catch (e) {
      console.error('❌ Erreur suppression contenu :', e);
    }
  };

  const filteredItems = items.filter((item) =>
    item.titre.toLowerCase().includes(search.toLowerCase())
  );

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95' }}>
          {matiere.nom}
        </Typography>

        {peutModifier && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
          >
            {active === 'cours' ? 'Ajouter un cours' : 'Ajouter un exercice'}
          </Button>
        )}
      </Box>

      {showForm && (
        <AjoutContenuForm
          onSubmit={handleAjout}
          onCancel={() => setShowForm(false)}
        />
      )}

      {items.length === 0 ? (
        <Typography color="text.secondary">Aucun contenu pour l'instant.</Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
            />

            {filteredItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                Aucun résultat.
              </Typography>
            ) : (
              filteredItems.map((item) => {
                const Icon = typeIcons[item.type] || ArticleIcon;
                const isSelected = selected?.id === item.id;
                return (
                  <Paper
                    key={item.id}
                    elevation={isSelected ? 3 : 0}
                    onClick={() => setSelected(item)}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isSelected ? '#7c3aed' : '#e2e8f0',
                      bgcolor: isSelected ? '#f5f3ff' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: '#7c3aed' }
                    }}
                  >
                    <Icon sx={{ color: isSelected ? '#7c3aed' : '#94a3b8', fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      fontWeight={isSelected ? 600 : 400}
                      sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {item.titre}
                    </Typography>
                    {peutModifier && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSupprimer(item.id);
                        }}
                        sx={{ color: '#ef4444', p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>
                );
              })
            )}
          </Box>

          <Paper elevation={1} sx={{ flex: 1, p: 3, borderRadius: 3, minHeight: 400 }}>
            {selected ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">{selected.titre}</Typography>
                  <Chip label={selected.type} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600 }} />
                </Box>

                {selected.type === 'TEXTE' && (
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selected.contenu}</Typography>
                )}
                {selected.type === 'IMAGE' && (
                  <Box component="img" src={buildMediaUrl(selected.mediaUrl)} sx={{ maxWidth: '100%', borderRadius: 2 }} />
                )}
                {selected.type === 'VIDEO' && (
                  <Box component="video" src={buildMediaUrl(selected.mediaUrl)} controls sx={{ maxWidth: '100%', borderRadius: 2 }} />
                )}
                {selected.type === 'AUDIO' && (
                  <Box component="audio" src={buildMediaUrl(selected.mediaUrl)} controls sx={{ width: '100%' }} />
                )}
                {selected.type === 'PDF' && (
                  <Box component="iframe" src={buildMediaUrl(selected.mediaUrl)} sx={{ width: '100%', height: 600, border: 'none', borderRadius: 2 }} />
                )}
                {selected.type === 'DOCUMENT' && (
                  <Button href={buildMediaUrl(selected.mediaUrl)} target="_blank" variant="outlined">
                    Télécharger le document
                  </Button>
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