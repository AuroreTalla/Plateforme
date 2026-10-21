import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
} from '../../Services/MatiereService.js';
import AjoutContenuForm from './AjoutContenuForm';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';
import { useRole } from '../../hooks/useRole';
import { useTrackConsultation } from '../../hooks/useTrackConsultation';
import RessourceViewer from './RessourceViewer';

const typeIcons = {
  TEXTE: ArticleIcon,
  IMAGE: ImageIcon,
  VIDEO: VideocamIcon,
  AUDIO: AudiotrackIcon,
  PDF: PictureAsPdfIcon,
  DOCUMENT: DescriptionIcon,
};

const typeLabels = {
  TEXTE: 'Texte', IMAGE: 'Image', VIDEO: 'Vidéo',
  AUDIO: 'Audio', PDF: 'PDF', DOCUMENT: 'Document',
};

function MatierePage({ defaultTab = 'cours' }) {
  const { matiereId, tab } = useParams();
  const active = tab || defaultTab;

  const { isProfOuAdmin: peutModifier } = useRole();
  const [matiere, setMatiere] = useState(null);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  useTrackConsultation(
  selected ? (active === 'cours' ? 'COURS' : 'EXERCICE') : null,
  selected?.id
);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

// dans le composant, après useParams :
const [searchParams, setSearchParams] = useSearchParams();
const itemParam = searchParams.get('item');
const [itemsTab, setItemsTab] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [matiereRes, itemsRes] = await Promise.all([
        getMatiereById(matiereId),
        active === 'cours' ? getCoursByMatiere(matiereId) : getExercicesByMatiere(matiereId)
      ]);
      setMatiere(matiereRes.data);
      setItemsTab(active);
      setItems(itemsRes.data);      // ← cette ligne manquait
      setSelected(null);
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

  useEffect(() => {
  if (!itemParam || itemsTab !== active) return;

  const cible = items.find((i) => String(i.id) === itemParam);
  if (cible) setSelected(cible);

  // retire le paramètre pour que fermer le dialogue ne le rouvre pas
  setSearchParams({}, { replace: true });
}, [itemParam, items, itemsTab, active, setSearchParams]);

  const { refetch: refetchMatieres } = useMatieres();

  const handleAjout = async ({ titre, type, contenu, mediaUrl }) => {
    const ajouter = active === 'cours' ? ajouterCours : ajouterExercice;
    await ajouter(matiereId, titre, type, contenu, mediaUrl);
    setShowForm(false);
    await load();
    await refetchMatieres();
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer ce contenu ?')) return;
    try {
      const supprimer = active === 'cours' ? supprimerCours : supprimerExercice;
      await supprimer(id);
      await load();
      await refetchMatieres();
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

      <AjoutContenuForm
        open={showForm}
        onSubmit={handleAjout}
        onCancel={() => setShowForm(false)}
      />

      {items.length === 0 ? (
  <Typography color="text.secondary">Aucun contenu pour l'instant.</Typography>
) : (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 900 }}>
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
            return (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white',
                  display: 'flex', alignItems: 'center', gap: 1.5, transition: 'all 0.15s',
                  '&:hover': { borderColor: '#c4b5fd' },
                }}
              >
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#f5f3ff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon sx={{ color: '#7c3aed', fontSize: 22 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{item.titre}</Typography>
                  <Typography variant="caption" color="text.secondary">{typeLabels[item.type]}</Typography>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelected(item)}
                  sx={{ textTransform: 'none', borderRadius: 2, flexShrink: 0,
                    color: '#7c3aed', borderColor: '#c4b5fd' }}
                >
                  Consulter
                </Button>

                {peutModifier && (
                  <IconButton size="small" onClick={() => handleSupprimer(item.id)} sx={{ color: '#ef4444', p: 0.5 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            );
          })
        )}
      </Box>
    )}

    <RessourceViewer
      ressource={selected}
      typeRessource={active === 'cours' ? 'COURS' : 'EXERCICE'}
      onClose={() => setSelected(null)}
    />
    </Box>
  );
}
export default MatierePage;