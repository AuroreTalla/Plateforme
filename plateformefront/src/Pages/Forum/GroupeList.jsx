// Components/Groupe/GroupeList.jsx
import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CardActionArea, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Chip, CircularProgress, InputAdornment, Grid, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Group as GroupIcon, Chat as ChatIcon } from '@mui/icons-material';
import { getAllGroupes, creerGroupe, joinGroupe } from '../../ConfigBackEnd/GroupService';
import { connectWebSocket, subscribeToGroupe, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';

function GroupeList({ onSelectGroupe }) {
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupeName, setNewGroupeName] = useState('');
  const [newGroupeDescription, setNewGroupeDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [creating, setCreating] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(null);

  const subscriptionRef = useRef(null);

  useEffect(() => {
    loadGroupes();

    // Connexion WebSocket pour liste des groupes
    connectWebSocket(
  () => console.log('WebSocket connecté pour la liste'),
  () => setErrorSnackbar('WebSocket liste groupe déconnecté')
);


    return () => disconnectWebSocket();
  }, []);

  const loadGroupes = async () => {
    try {
      setLoading(true);
      const res = await getAllGroupes();
      setGroupes(res.data);
    } catch (error) {
      console.error('Erreur chargement groupes:', error);
      setErrorSnackbar('Impossible de charger les groupes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroupe = async () => {
    if (!newGroupeName.trim()) return;
    try {
      setCreating(true);
      await creerGroupe(newGroupeName, newGroupeDescription);
      setShowCreateModal(false);
      setNewGroupeName('');
      setNewGroupeDescription('');
      loadGroupes();
    } catch (error) {
      console.error('Erreur création groupe:', error);
      setErrorSnackbar('Impossible de créer le groupe');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGroupe = async (nom) => {
    try {
      await joinGroupe(nom);
      onSelectGroupe(nom);

      // Abonnement WebSocket pour mise à jour en temps réel
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      subscriptionRef.current = subscribeToGroupe(nom, (message) => {
        setGroupes(prev => prev.map(g => g.nom === nom ? { ...g, nombreMembres: message.nombreMembres || g.nombreMembres } : g));
      });
    } catch (error) {
      console.error('Erreur join groupe:', error);
      setErrorSnackbar('Impossible de rejoindre le groupe');
    }
  };

  const filteredGroupes = groupes.filter(groupe =>
    groupe.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 10 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="bold">Mes Groupes</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateModal(true)}>Créer un groupe</Button>
          </Box>
          <TextField
            fullWidth
            placeholder="Rechercher un groupe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
        {filteredGroupes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <GroupIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="medium">{searchTerm ? 'Aucun groupe trouvé' : 'Aucun groupe disponible'}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm ? 'Essayez une autre recherche' : 'Créez votre premier groupe pour commencer'}
            </Typography>
            {!searchTerm && <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateModal(true)}>Créer un groupe</Button>}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredGroupes.map((groupe) => (
              <Grid item xs={12} sm={6} md={4} key={groupe.id}>
                <Card elevation={2} sx={{ height: '100%', '&:hover': { elevation: 4 } }}>
                  <CardActionArea onClick={() => handleJoinGroupe(groupe.nom)} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', mr: 2 }}><GroupIcon /></Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="bold">{groupe.nom}</Typography>
                          <Chip label={`${groupe.nombreMembres} ${groupe.nombreMembres > 1 ? 'membres' : 'membre'}`} size="small" sx={{ mt: 0.5 }} />
                        </Box>
                      </Box>
                      {groupe.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {groupe.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <ChatIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">Ouvrir le chat</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={showCreateModal} onClose={() => !creating && setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouveau groupe</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Nom du groupe" type="text" fullWidth variant="outlined" value={newGroupeName} onChange={(e) => setNewGroupeName(e.target.value)} placeholder="Ex: Développeurs React" required sx={{ mb: 2 }} />
          <TextField margin="dense" label="Description (optionnelle)" type="text" fullWidth variant="outlined" multiline rows={3} value={newGroupeDescription} onChange={(e) => setNewGroupeDescription(e.target.value)} placeholder="Décrivez votre groupe..." />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setShowCreateModal(false); setNewGroupeName(''); setNewGroupeDescription(''); }} disabled={creating}>Annuler</Button>
          <Button onClick={handleCreateGroupe} variant="contained" disabled={!newGroupeName.trim() || creating}>{creating ? <CircularProgress size={24} /> : 'Créer'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!errorSnackbar} autoHideDuration={4000} onClose={() => setErrorSnackbar(null)}>
        <Alert severity="error" onClose={() => setErrorSnackbar(null)}>{errorSnackbar}</Alert>
      </Snackbar>
    </Box>
  );
}

export default GroupeList;
