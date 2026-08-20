import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Paper, Grid, TextField, Button, Avatar,
    Card, CardContent, CardActionArea, IconButton,
    Fade, InputAdornment, CircularProgress
} from '@mui/material';
import {
    MenuBook as BookIcon,
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useMatieres } from '../../../Composants/Matiere/MatiereProvider.jsx';

const couleurs = ['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706'];
const couleurPour = (id) => couleurs[id % couleurs.length];

export default function MatiereList() {
    const navigate = useNavigate();
    const { matieres, loading } = useMatieres();
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = matieres.filter(m =>
        m.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#8b5cf6' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                        Gestion des Matières
                    </Typography>
                    <Typography color="#64748b">
                        Créez et organisez les enseignements disponibles sur la plateforme.
                    </Typography>
                </Box>
                <IconButton
                    onClick={() => navigate('/dashboard/matieres/create')}
                    sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}
                >
                    <MoreIcon />
                </IconButton>
            </Box>

            <TextField
                fullWidth
                placeholder="Rechercher une matière..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>
                }}
                sx={{ mb: 4, bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />

            <Grid container spacing={3}>
                {filtered.map((matiere, index) => {
                    const color = couleurPour(matiere.id);
                    return (
                        <Fade in={true} timeout={300 + index * 100} key={matiere.id}>
                            <Grid item xs={12} sm={6} lg={4}>
                                <Card elevation={0} sx={{
                                    borderRadius: 4,
                                    border: '1px solid #e2e8f0',
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 30px -10px rgba(0,0,0,0.1)' }
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar sx={{ bgcolor: `${color}15`, color, width: 56, height: 56, borderRadius: 3, mr: 2 }}>
                                                <BookIcon fontSize="large" />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" color="#1e293b">{matiere.nom}</Typography>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" color="#64748b" sx={{ mb: 3, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {matiere.description || 'Aucune description.'}
                                        </Typography>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => navigate(`/dashboard/matiere/${matiere.id}/cours`)}
                                            sx={{
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                color,
                                                borderColor: `${color}44`,
                                                '&:hover': { bgcolor: `${color}05`, borderColor: color }
                                            }}
                                        >
                                            Gérer la matière
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Fade>
                    );
                })}

                <Grid item xs={12} sm={6} lg={4}>
                    <CardActionArea
                        onClick={() => navigate('/dashboard/matieres/create')}
                        sx={{ height: '100%', borderRadius: 4 }}
                    >
                        <Paper elevation={0} sx={{
                            height: '100%',
                            borderRadius: 4,
                            border: '2px dashed #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
                            color: '#94a3b8',
                            bgcolor: 'transparent',
                            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#7c3aed', color: '#7c3aed' }
                        }}>
                            <AddIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography fontWeight="bold">Ajouter une matière</Typography>
                        </Paper>
                    </CardActionArea>
                </Grid>
            </Grid>
        </Box>
    );
}