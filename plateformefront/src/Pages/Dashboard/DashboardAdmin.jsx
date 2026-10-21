import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import ForumIcon from '@mui/icons-material/Forum';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getStats } from '../../Services/StatsService.js';
import DashboardBanner from '../../Composants/Dashboard/DashboardBanner';
import StatCard from '../../Composants/Dashboard/StatCard';
import DashboardProfesseur from './DashboardProfesseur';

export default function DashboardAdmin({ currentUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(undefined);

  useEffect(() => {
    getStats().then((res) => setStats(res.data)).catch(() => setStats({}));
  }, []);

  const cartes = [
    { label: 'Utilisateurs', value: stats?.utilisateurs, icon: PeopleIcon, bg: '#7c3aed', path: '/dashboard/users' },
    { label: 'Cours', value: stats?.cours, icon: MenuBookIcon, bg: '#a78bfa', path: '/dashboard/matieres/list' },
    { label: 'Exercices', value: stats?.exercices, icon: DescriptionIcon, bg: '#4c1d95', path: '/dashboard/matieres/list' },
    { label: 'Publications', value: stats?.publications, icon: ForumIcon, bg: '#8b5cf6', path: '/dashboard/forums' },
    { label: 'Taux de résolution',
      value: stats ? `${stats.tauxResolution ?? 0} %` : undefined,
      icon: CheckCircleIcon, bg: '#ddd6fe', color: '#4c1d95', path: '/dashboard/forums' },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <DashboardBanner
        titre={`Bonjour ${currentUser.name} 👋`}
        sous="Vue d'ensemble de la plateforme." />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Aperçu</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {cartes.map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 4, lg: 'grow' }}>
            <StatCard {...c} onClick={() => navigate(c.path)} />
          </Grid>
        ))}
      </Grid>

      <DashboardProfesseur currentUser={currentUser} showHeader={false} />
    </Box>
  );
}