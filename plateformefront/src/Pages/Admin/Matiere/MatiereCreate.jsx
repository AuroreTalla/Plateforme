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

import { creerMatiere } from '../../../ConfigBackEnd/MatiereService';



export default function MatiereCreate() {
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
    await creerMatiere(nom, description);
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
