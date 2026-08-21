import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Chip, IconButton, Button, CircularProgress, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getReponsesByPublication, proposerSolution, validerSolution, devaliderSolution } from '../../ConfigBackEnd/PublicationService';
import { subscribeToReponses, sendReponse } from '../../ConfigBackEnd/WebSocketConfig';
import { formatDate } from '../../ConfigBackEnd/FormatDate';

import ReponseForm from './ReponseForm';

function PublicationDetail({ publication, onBack, currentUser }) {
  const [reponses, setReponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [statut, setStatut] = useState(publication.statut);

  const isAuteur = currentUser?.id === publication.user?.id;
  const isAdmin = currentUser?.statut === 'ADMIN' || currentUser?.statut === 'PROFESSEUR';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getReponsesByPublication(publication.id);
        if (mounted) setReponses(res.data);
      } catch (e) {
        console.error('❌ Erreur chargement réponses :', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [publication.id]);

  useEffect(() => {
    const sub = subscribeToReponses(publication.id, (data) => {
      // Un DTO de réponse mis à jour (nouvelle ou modifiée) arrive ici
      setReponses((prev) => {
        const exists = prev.some((r) => r.id === data.id);
        if (exists) {
          return prev.map((r) => (r.id === data.id ? data : r));
        }
        return [...prev, data];
      });
      if (data.valideeParAdmin) setStatut('RESOLUE');
    });
    return () => sub?.unsubscribe();
  }, [publication.id]);

  const handleReply = (content) => {
    const success = sendReponse(publication.id, content, currentUser.email);
    if (success) setShowReplyForm(false);
  };

  const handleProposer = async (reponseId) => {
    try {
      await proposerSolution(reponseId);
    } catch (e) {
      console.error('❌ Erreur proposition solution :', e);
    }
  };

  const handleValider = async (reponseId) => {
    try {
      const res = await validerSolution(reponseId);
      setStatut('RESOLUE');
      setReponses((prev) => prev.map((r) => (r.id === reponseId ? res.data : r)));
    } catch (e) {
      console.error('❌ Erreur validation :', e);
    }
  };

  const handleDevalider = async (reponseId) => {
    try {
      const res = await devaliderSolution(reponseId);
      setReponses((prev) => prev.map((r) => (r.id === reponseId ? res.data : r)));
    } catch (e) {
      console.error('❌ Erreur dévalidation :', e);
    }
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      <IconButton onClick={onBack} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h5" fontWeight="bold">{publication.titre}</Typography>
          <Chip
            label={statut === 'RESOLUE' ? '🟢 Résolue' : '🟠 Non résolue'}
            sx={{
              bgcolor: statut === 'RESOLUE' ? '#dcfce7' : '#ffedd5',
              color: statut === 'RESOLUE' ? '#166534' : '#9a3412',
              fontWeight: 600
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
          {publication.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Par {publication.user?.name || 'Utilisateur'} · {formatDate(publication.datePublication)}
        </Typography>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Réponses ({reponses.length})
      </Typography>

      {loading ? (
        <CircularProgress size={30} sx={{ color: '#8b5cf6' }} />
      ) : (
        reponses.map((rep) => (
          <Paper
            key={rep.id}
            elevation={0}
            sx={{
              p: 2, mb: 2, borderRadius: 2,
              border: rep.valideeParAdmin ? '2px solid #22c55e' : '1px solid #e2e8f0',
              bgcolor: rep.valideeParAdmin ? '#f0fdf4' : 'white'
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{rep.content}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {rep.user?.name || 'Utilisateur'} · {formatDate(rep.dateReponse)}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {rep.valideeParAdmin && (
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    label="Solution validée"
                    size="small"
                    sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }}
                  />
                )}
                {!rep.valideeParAdmin && rep.estSolutionProposee && (
                  <Chip label="Solution proposée" size="small" sx={{ bgcolor: '#fef9c3', color: '#854d0e' }} />
                )}

                {isAuteur && !rep.estSolutionProposee && (
                  <Button size="small" onClick={() => handleProposer(rep.id)}>
                    Marquer comme solution
                  </Button>
                )}

                {isAdmin && rep.estSolutionProposee && !rep.valideeParAdmin && (
                  <Button size="small" variant="contained" color="success" onClick={() => handleValider(rep.id)}>
                    Valider
                  </Button>
                )}
                {isAdmin && rep.valideeParAdmin && (
                  <Button size="small" color="warning" onClick={() => handleDevalider(rep.id)}>
                    Dévalider
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        ))
      )}

      <Divider sx={{ my: 2 }} />

      {showReplyForm ? (
        <ReponseForm onSubmit={handleReply} onCancel={() => setShowReplyForm(false)} />
      ) : (
        <Button variant="contained" onClick={() => setShowReplyForm(true)} sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Répondre
        </Button>
      )}
    </Box>
  );
}

export default PublicationDetail;