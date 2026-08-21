import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardActionArea, Avatar, Grid } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';

export default function DashboardEleve({ currentUser }) {
  const navigate = useNavigate();
  const { matieres, loading } = useMatieres();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
        Bonjour {currentUser.name} 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Voici un aperçu de vos matières.
      </Typography>

      {!loading && (
        <Grid container spacing={3}>
          {matieres.map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m.id}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <CardActionArea onClick={() => navigate(`/dashboard/matiere/${m.id}/cours`)} sx={{ p: 2 }}>
                  <CardContent sx={{ p: '0 !important', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed' }}>
                      <MenuBookIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{m.nom}</Typography>
                      <Typography variant="body2" color="text.secondary">Accéder aux cours</Typography>
                      <Typography variant="caption" color="text.secondary">
  {m.nbCours} cours · {m.nbExercices} exercices
</Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}