import { Box, Typography, Grid, Card, CardContent, CardActionArea, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DescriptionIcon from '@mui/icons-material/Description';
import ForumIcon from '@mui/icons-material/Forum';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';    
import { getAllUsers } from '../../Services/UserService';
import { getDemandesProfesseur } from '../../Services/ProfService';
import DashboardProfesseur from './DashboardProfesseur';
import { getStats } from '../../Services/StatsService.js';


export default function DashboardAdmin({ currentUser }) {
  const navigate = useNavigate();
  const [nbUsers, setNbUsers] = useState(null);
  const [nbDemandes, setNbDemandes] = useState(null);

  const [stats, setStats] = useState(null);

useEffect(() => {
  getStats().then((res) => setStats(res.data)).catch(() => setStats({}));
}, []);

const adminStats = [
  { label: 'Utilisateurs', value: stats?.utilisateurs, icon: PeopleIcon, color: '#2563eb', path: '/dashboard/users' },
  { label: 'Cours', value: stats?.cours, icon: MenuBookIcon, color: '#059669', path: '/dashboard/matieres/list' },
  { label: 'Exercices', value: stats?.exercices, icon: DescriptionIcon, color: '#d97706', path: '/dashboard/matieres/list' },
  { label: 'Publications', value: stats?.publications, icon: ForumIcon, color: '#7c3aed', path: '/dashboard/forums' },
  { label: 'Taux de résolution', value: stats ? `${stats.tauxResolution} %` : undefined, icon: CheckCircleIcon, color: '#16a34a', path: '/dashboard/forums' },
];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
        Tableau de bord — Administration
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Vue d'ensemble de la plateforme et de vos matières.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminStats.map((s) => {
          const Icon = s.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={s.label}>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                <CardActionArea onClick={() => navigate(s.path)} sx={{ p: 2 }}>
                  <CardContent sx={{ p: '0 !important' }}>
                    <Icon sx={{ color: s.color, fontSize: 32, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {s.value === null ? <CircularProgress size={24} /> : s.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Réutilise directement la vue professeur pour les matières */}
      <DashboardProfesseur currentUser={currentUser} />
    </Box>
  );
}