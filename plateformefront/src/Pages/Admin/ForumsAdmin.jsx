import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CardActionArea, Typography, Avatar, CircularProgress, TextField, InputAdornment, Grid, Alert, Fade } from '@mui/material';
import {
    Button, IconButton} from '@mui/material';
import { Search as SearchIcon, Group as GroupIcon, Chat as ChatIcon } from '@mui/icons-material';
import { getAllGroupes } from '../../ConfigBackEnd/GroupService';
import PublicationList from '../../Pages/Forum/PublicationList';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { supprimerMatiere } from '../../ConfigBackEnd/MatiereService';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';

export default function ForumsAdmin() {
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroupe, setSelectedGroupe] = useState(null);
    const [error, setError] = useState(null);
    const [wsConnected, setWsConnected] = useState(false);
    const wsInitialized = useRef(false);
    const { matieres, refetch } = useMatieres();
const [groupeASupprimer, setGroupeASupprimer] = useState(null);
const [deleting, setDeleting] = useState(false);

const handleConfirmerSuppression = async () => {
  if (!groupeASupprimer) return;

  // Retrouver la matière liée à ce groupe (même nom, comme convenu)
  const matiere = matieres.find((m) => m.groupeId === groupeASupprimer.id);
  if (!matiere) {
    setError("Aucune matière associée à ce groupe, suppression impossible depuis cet écran.");
    setGroupeASupprimer(null);
    return;
  }

  setDeleting(true);
  try {
    await supprimerMatiere(matiere.id);
    await Promise.all([loadGroupes(), refetch()]);
    setGroupeASupprimer(null);
  } catch (e) {
    console.error('❌ Erreur suppression matière :', e);
    setError(e.response?.data?.message || "Erreur lors de la suppression.");
  } finally {
    setDeleting(false);
  }
};

    useEffect(() => {
        loadGroupes();
        if (!wsInitialized.current) {
            wsInitialized.current = true;
            connectWebSocket(
                () => setWsConnected(true),
                () => setWsConnected(false)
            );
        }
        return () => {
            disconnectWebSocket();
            wsInitialized.current = false;
        };
    }, []);

    const loadGroupes = async () => {
        try {
            setLoading(true);
            const res = await getAllGroupes();
            setGroupes(res.data);
        } catch (error) {
            console.error('Erreur chargement groupes:', error);
            setError('Impossible de charger la liste des groupes');
        } finally {
            setLoading(false);
        }
    };

    const filteredGroupes = groupes.filter(groupe =>
        groupe.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGroupe) {
        return (
            <Box sx={{ height: '100%' }}>
                <PublicationList
                    groupeId={selectedGroupe.id}
                    wsConnected={wsConnected}
                    onBack={() => setSelectedGroupe(null)}
                />
            </Box>
        );
    }

    // ... reste du composant identique, sauf la ligne du clic :

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress sx={{ color: '#7c3aed' }} />
            </Box>
        );
    }

    return (

    
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#4c1d95' }}>
                    Administration des Forums
                </Typography>
                <Typography color="#64748b" sx={{ mb: 4 }}>
                    Supervision et modération de tous les espaces de discussion.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    placeholder="Rechercher un groupe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        bgcolor: 'white',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                            '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
                        }
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredGroupes.map((groupe, index) => (
                    <Fade in={true} timeout={300 + index * 50} key={groupe.id}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card elevation={0} sx={{
                                height: '100%',
                                borderRadius: 4,
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px -10px rgba(124, 58, 237, 0.2)', borderColor: '#7c3aed' }
                            }}>
                                <CardActionArea
                                    onClick={() => setSelectedGroupe(groupe)}
                                    sx={{ height: '100%', p: 1 }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar sx={{ width: 56, height: 56, bgcolor: '#f5f3ff', color: '#7c3aed', mr: 2, borderRadius: 3 }}>
                                                <GroupIcon />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" color="#1e293b">{groupe.nom}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{
                                            mb: 3,
                                            color: '#64748b',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            height: 40
                                        }}>
                                            {groupe.description || "Aucune description disponible."}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: '1px solid #f1f5f9', justifyContent: 'space-between' }}>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <ChatIcon sx={{ fontSize: 18, mr: 1, color: '#7c3aed' }} />
    <Typography variant="body2" color="#7c3aed" fontWeight="bold">
      Accéder au chat
    </Typography>
  </Box>
  <IconButton
    size="small"
    onClick={(e) => {
      e.stopPropagation();
      setGroupeASupprimer(groupe);
    }}
    sx={{ color: '#ef4444' }}
  >
    <DeleteIcon fontSize="small" />
  </IconButton>
</Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Fade>
                ))}
                {filteredGroupes.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <GroupIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                            <Typography color="text.secondary">Aucun groupe trouvé.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <Dialog open={!!groupeASupprimer} onClose={() => setGroupeASupprimer(null)}>
  <DialogTitle>Supprimer cette matière ?</DialogTitle>
  <DialogContent>
    <Typography>
      Ceci supprimera définitivement <strong>{groupeASupprimer?.nom}</strong>,
      son forum, ses cours et ses exercices. Cette action est irréversible.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setGroupeASupprimer(null)} disabled={deleting}>
      Annuler
    </Button>
    <Button
      onClick={handleConfirmerSuppression}
      disabled={deleting}
      color="error"
      variant="contained"
    >
      {deleting ? <CircularProgress size={20} color="inherit" /> : 'Supprimer'}
    </Button>
  </DialogActions>
</Dialog>
        </Box>
    );
}
