import { Box, Typography, Grid } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';
import DashboardBanner from '../../Composants/Dashboard/DashboardBanner';
import StatCard from '../../Composants/Dashboard/StatCard';
import MatiereRow from '../../Composants/Dashboard/MatiereRow';

export default function DashboardEleve({ currentUser }) {
  const { matieres, loading } = useMatieres();
  const totalCours = matieres.reduce((s, m) => s + m.nbCours, 0);
  const totalExos = matieres.reduce((s, m) => s + m.nbExercices, 0);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <DashboardBanner
        titre={`Bonjour ${currentUser.name} 👋`}
        sous="Prêt à continuer vos révisions ?" />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Aperçu</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Matières" value={loading ? undefined : matieres.length} icon={SchoolIcon} bg="#7c3aed" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Cours disponibles" value={loading ? undefined : totalCours} icon={MenuBookIcon} bg="#a78bfa" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard label="Exercices disponibles" value={loading ? undefined : totalExos} icon={DescriptionIcon} bg="#4c1d95" />
        </Grid>
      </Grid>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Mes matières</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {matieres.map((m) => <MatiereRow key={m.id} matiere={m} />)}
      </Box>
    </Box>
  );
}