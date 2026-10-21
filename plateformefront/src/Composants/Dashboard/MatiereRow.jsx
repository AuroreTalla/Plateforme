import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ForumIcon from '@mui/icons-material/Forum';

const btn = { textTransform: 'none', borderRadius: 2, color: '#7c3aed', borderColor: '#c4b5fd' };

export default function MatiereRow({ matiere, enAttente = 0 }) {
  const navigate = useNavigate();

  return (
    <Paper elevation={0} sx={{
      p: 2, borderRadius: 3, border: '1px solid #e2e8f0', display: 'flex',
      alignItems: 'center', gap: 2, flexWrap: 'wrap', '&:hover': { borderColor: '#c4b5fd' },
    }}>
      <Box sx={{ width: 64, height: 64, borderRadius: 3, flexShrink: 0,
        background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MenuBookIcon fontSize="large" />
      </Box>

      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography fontWeight="bold" sx={{ color: '#4c1d95' }}>{matiere.nom}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {matiere.description || 'Aucune description.'}
        </Typography>
        <Typography variant="caption" fontWeight={600} color="text.secondary">
          {matiere.nbCours} cours · {matiere.nbExercices} exercices
        </Typography>
        {enAttente > 0 && (
          <Chip label={`${enAttente} question(s) en attente`} size="small"
            sx={{ ml: 1, bgcolor: '#ffedd5', color: '#9a3412', fontWeight: 600 }} />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" sx={btn}
          onClick={() => navigate(`/dashboard/matiere/${matiere.id}/cours`)}>Cours</Button>
        <Button size="small" variant="outlined" sx={btn}
          onClick={() => navigate(`/dashboard/matiere/${matiere.id}/exercices`)}>Exercices</Button>
        <Button size="small" variant="contained" startIcon={<ForumIcon />}
          sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
          onClick={() => navigate(`/dashboard/forum/${matiere.groupeId}`)}>Forum</Button>
      </Box>
    </Paper>
  );
}