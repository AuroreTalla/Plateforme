import { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Card, CardActionArea, CardContent, Chip, Button, CircularProgress, TextField, Pagination, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../../Composants/Authentification/AuthContext';
import { getPublicationsByGroupe } from '../../ConfigBackEnd/PublicationService';
import { subscribeToPublications, sendPublication } from '../../ConfigBackEnd/WebSocketConfig';
import PublicationDetail from './PublicationDetail';
import NewPublicationForm from './NewPublicationForm';
import { formatDate } from '../../ConfigBackEnd/FormatDate';

const PAGE_SIZE = 10;

function PublicationList({ groupeId, wsConnected  }) {
  const { currentUser } = useContext(AuthContext);

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPub, setSelectedPub] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce : attend 400ms après la dernière frappe avant de lancer la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(0); // retour à la page 1 à chaque nouvelle recherche
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadPublications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPublicationsByGroupe(groupeId, { search, page, size: PAGE_SIZE });
      setPublications(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.error('❌ Erreur chargement publications :', e);
    } finally {
      setLoading(false);
    }
  }, [groupeId, search, page]);

  useEffect(() => {
    loadPublications();
  }, [loadPublications]);

  // Nouvelle publication en temps réel : seulement pertinent en page 1 sans filtre actif
  useEffect(() => {
    const sub = subscribeToPublications(groupeId, () => {
      if (page === 0 && search === '') {
        loadPublications();
      }
    });
    return () => sub?.unsubscribe();
  }, [groupeId, page, search, loadPublications]);

  useEffect(() => {
    setSelectedPub(null);
    setShowForm(false);
    setSearchInput('');
    setSearch('');
    setPage(0);
    }, [groupeId]);

  const handleCreate = (titre, content) => {
    const success = sendPublication(groupeId, titre, content, currentUser.email);
    if (success) setShowForm(false);
  };

  if (selectedPub) {
    return (
      <PublicationDetail
        wsConnected={wsConnected}
        publication={selectedPub}
        onBack={() => setSelectedPub(null)}
        currentUser={currentUser}
      />
    );
  }

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#4c1d95' }}>
          Publications
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          disabled={!wsConnected}
          sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
        >
          Nouvelle publication
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Rechercher par mot-clé (titre ou contenu)..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#94a3b8' }} />
            </InputAdornment>
          )
        }}
      />

      {showForm && (
        <NewPublicationForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#8b5cf6' }} />
        </Box>
      ) : publications.length === 0 ? (
        <Typography color="text.secondary">
          {search ? `Aucun résultat pour "${search}".` : 'Aucune publication pour l\'instant.'}
        </Typography>
      ) : (
        <>
          {publications.map((pub) => (
            <Card key={pub.id} elevation={1} sx={{ mb: 2, borderRadius: 3 }}>
              <CardActionArea onClick={() => setSelectedPub(pub)} sx={{ p: 2 }}>
                <CardContent sx={{ p: '0 !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="600">{pub.titre}</Typography>
                    <Chip
                      label={pub.statut === 'RESOLUE' ? '🟢 Résolue' : '🟠 Non résolue'}
                      size="small"
                      sx={{
                        bgcolor: pub.statut === 'RESOLUE' ? '#dcfce7' : '#ffedd5',
                        color: pub.statut === 'RESOLUE' ? '#166534' : '#9a3412',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                  }}>
                    {pub.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Par {pub.user?.name || 'Utilisateur'} · {formatDate(pub.datePublication)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_, value) => setPage(value - 1)}
                color="secondary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default PublicationList;