import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useMatieres } from '../../Composants/Matiere/MatiereProvider.jsx';
import { compterPublicationsNonResolues } from '../../Services/MatiereService.js';
import DashboardBanner from '../../Composants/Dashboard/DashboardBanner';
import StatCard from '../../Composants/Dashboard/StatCard';
import MatiereRow from '../../Composants/Dashboard/MatiereRow';

export default function DashboardProfesseur({ currentUser, showHeader = true }) {
  const { matieres, loading } = useMatieres();
  const [nonResolues, setNonResolues] = useState(undefined);

  useEffect(() => {
    compterPublicationsNonResolues()
      .then((res) => setNonResolues(res.data))
      .catch(() => setNonResolues({}));
  }, []);

  const totalCours = matieres.reduce((s, m) => s + m.nbCours, 0);
  const totalExos = matieres.reduce((s, m) => s + m.nbExercices, 0);
  const totalAttente = nonResolues
    ? Object.values(nonResolues).reduce((s, n) => s + n, 0) : undefined;

  return (
    <Box sx={{ maxWidth: 1200, mx: showHeader ? 'auto' : 0 }}>
      {showHeader && (
        <DashboardBanner
          titre={`Bonjour ${currentUser.name} 👋`}
          sous="Gérez vos matières et suivez les échanges de vos forums." />
      )}

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Aperçu</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Matières" value={loading ? undefined : matieres.length} icon={SchoolIcon} bg="#7c3aed" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Cours" value={loading ? undefined : totalCours} icon={MenuBookIcon} bg="#a78bfa" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Exercices" value={loading ? undefined : totalExos} icon={DescriptionIcon} bg="#4c1d95" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard label="Questions en attente" value={totalAttente} icon={HelpOutlineIcon} bg="#ddd6fe" color="#4c1d95" />
        </Grid>
      </Grid>

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Mes matières</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {matieres.map((m) => (
          <MatiereRow key={m.id} matiere={m} enAttente={nonResolues?.[m.groupeId] ?? 0} />
        ))}
      </Box>
    </Box>
  );
}