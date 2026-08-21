import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea, Avatar, Grid, Chip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ForumIcon from '@mui/icons-material/Forum';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';
import { useState, useEffect } from 'react';
import { compterPublicationsNonResolues } from '../../ConfigBackEnd/MatiereService';

export default function DashboardProfesseur({ currentUser, showHeader = true }) {
  const navigate = useNavigate();
  const { matieres, loading } = useMatieres();
  const [nonResolues, setNonResolues] = useState({});

  useEffect(() => {
  matieres.forEach((m) => {
    compterPublicationsNonResolues(m.groupeId)
      .then((res) => setNonResolues((prev) => ({ ...prev, [m.id]: res.data.count })))
      .catch(() => {});
  });
}, [matieres]);

  return (
    <Box sx={{ maxWidth: 1200, mx: showHeader ? 'auto' : 0 }}>
      {showHeader && (
        <>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
            Bonjour {currentUser.name} 👋
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Gérez vos matières et suivez les échanges dans vos forums.
          </Typography>
        </>
      )}

      {!loading && (
        <Grid container spacing={3}>
          {matieres.map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m.id}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed' }}>
                      <MenuBookIcon />
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">{m.nom}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
  {m.nbCours} cours · {m.nbExercices} exercices
</Typography>
{nonResolues[m.id] > 0 && (
  <Chip
    label={`${nonResolues[m.id]} question(s) en attente`}
    size="small"
    sx={{ mt: 1, bgcolor: '#ffedd5', color: '#9a3412', fontWeight: 600 }}
  />
)}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CardActionArea
                      onClick={() => navigate(`/dashboard/matiere/${m.id}/cours`)}
                      sx={{ borderRadius: 2, p: 1, border: '1px solid #e2e8f0', flex: 1, textAlign: 'center' }}
                    >
                      <Typography variant="body2" fontWeight="600">Cours</Typography>
                    </CardActionArea>
                    <CardActionArea
                      onClick={() => navigate(`/dashboard/forum/${m.groupeId}`)}
                      sx={{ borderRadius: 2, p: 1, border: '1px solid #e2e8f0', flex: 1, textAlign: 'center' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <ForumIcon fontSize="small" />
                        <Typography variant="body2" fontWeight="600">Forum</Typography>
                      </Box>
                    </CardActionArea>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}