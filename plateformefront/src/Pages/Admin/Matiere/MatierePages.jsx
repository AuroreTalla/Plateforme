import React from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, Avatar,
    Card, CardContent, CardActionArea, IconButton, Chip,
    Alert, CircularProgress, Fade, InputAdornment
} from '@mui/material';
import {
    MenuBook as BookIcon,
    Add as AddIcon,
    Search as SearchIcon,
    MoreVert as MoreIcon,
    People as PeopleIcon,
    Assignment as TaskIcon,
    Description as DescIcon
} from '@mui/icons-material';

// Mock data pour les matières
const mockMatieres = [
    { id: 1, nom: "Mathématiques", description: "Algèbre, Analyse, Géométrie", prof: "Jean Dupont", students: 45, color: "#7c3aed" },
    { id: 2, nom: "Physique", description: "Mécanique, Optique, Électromagnétisme", prof: "Marie Curie", students: 38, color: "#3b82f6" },
    { id: 3, nom: "Chimie", description: "Chimie organique et inorganique", prof: "Antoine Lavoisier", students: 30, color: "#ec4899" },
    { id: 4, nom: "Informatique", description: "Algorithmique et Développement Web", prof: "Alan Turing", students: 52, color: "#10b981" },
];

export function MatiereList() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filtered = mockMatieres.filter(m => m.nom.toLowerCase().includes(searchTerm.toLowerCase()));

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
                <IconButton sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>
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
                {filtered.map((matiere, index) => (
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
                                        <Avatar sx={{ bgcolor: `${matiere.color}15`, color: matiere.color, width: 56, height: 56, borderRadius: 3, mr: 2 }}>
                                            <BookIcon fontSize="large" />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" color="#1e293b">{matiere.nom}</Typography>
                                            <Typography variant="caption" color="#64748b" fontWeight={600}>
                                                Prof: {matiere.prof}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" color="#64748b" sx={{ mb: 3, minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {matiere.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                                            <PeopleIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                            <Typography variant="caption" fontWeight="bold">{matiere.students}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                                            <TaskIcon sx={{ fontSize: 18, mr: 0.5 }} />
                                            <Typography variant="caption" fontWeight="bold">12 exos</Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            color: matiere.color,
                                            borderColor: `${matiere.color}44`,
                                            '&:hover': { bgcolor: `${matiere.color}05`, borderColor: matiere.color }
                                        }}
                                    >
                                        Gérer la matière
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Fade>
                ))}
                {/* Card Ajout Rapide */}
                <Grid item xs={12} sm={6} lg={4}>
                    <CardActionArea sx={{ height: '100%', borderRadius: 4 }}>
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

export function MatiereCreate() {
    const [nom, setNom] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // 2. Créer le groupe associé
            const { creerGroupe } = await import('../../../ConfigBackEnd/GroupService');
            await creerGroupe(nom, `Groupe officiel pour la matière ${nom}`);

            setSuccess(true);
            setNom('');
            setDescription('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 700, width: '100%' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 4, textAlign: 'center' }}>
                    Nouvelle Matière
                </Typography>

                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                    {success && (
                        <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>
                            La matière et son groupe de discussion ont été créés avec succès !
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, ml: 1 }}>Nom de la matière</Typography>
                                <TextField
                                    fullWidth
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    placeholder="Ex: Intelligence Artificielle"
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><BookIcon sx={{ color: '#94a3b8' }} /></InputAdornment>
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, ml: 1 }}>Description détaillée</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={6}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Décrivez les objectifs pédagogiques..."
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><DescIcon sx={{ color: '#94a3b8' }} /></InputAdornment>
                                    }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        bgcolor: '#7c3aed',
                                        borderRadius: 3,
                                        py: 1.8,
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#6d28d9', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Créer la matière et son forum'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="#64748b">
                        Note: La création d'une matière génère automatiquement <br /> un groupe de discussion privé associé.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
