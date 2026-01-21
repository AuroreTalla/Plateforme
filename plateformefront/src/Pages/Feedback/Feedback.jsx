import React, { useState, useContext } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, Avatar,
    Rating, Alert, Snackbar, Card, CardContent, Chip, Divider, Fade
} from '@mui/material';
import {
    Send as SendIcon,
    Feedback as FeedbackIcon,
    RecordVoiceOver as VoiceIcon,
    AdminPanelSettings as AdminIcon,
    Person as PersonIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { AuthContext } from "../../Composants/Authentification/AuthContext";

// Mock data pour l'admin
const mockFeedbacks = [
    { id: 1, user: "Jean Dupont", role: "ELEVE", subject: "Ergonomie", comment: "Le nouveau design du forum est vraiment top, très fluide !", rating: 5, date: "2024-01-20" },
    { id: 2, user: "Marie Curie", role: "PROFESSEUR", subject: "Outils de cours", comment: "Il manque une option pour uploader des PDF plus lourds.", rating: 4, date: "2024-01-18" },
    { id: 3, user: "Thomas Sankara", role: "ELEVE", subject: "Connexion", comment: "J'ai eu quelques ralentissements hier soir vers 20h.", rating: 3, date: "2024-01-15" },
];

export default function Feedback() {
    const { currentUser } = useContext(AuthContext);
    const isAdmin = currentUser?.role === 'ADMIN';

    const [formData, setFormData] = useState({ subject: '', comment: '', rating: 5 });
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Feedback envoyé:", formData);
        // Simulation d'envoi
        setSuccess(true);
        setFormData({ subject: '', comment: '', rating: 5 });
    };

    // --- VUE ADMIN ---
    if (isAdmin) {
        return (
            <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                            Gestion des Retours
                        </Typography>
                        <Typography color="#64748b">
                            Consultez les avis et suggestions de la communauté pour améliorer la plateforme.
                        </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed', width: 56, height: 56 }}>
                        <AdminIcon fontSize="large" />
                    </Avatar>
                </Box>

                <Grid container spacing={3}>
                    {mockFeedbacks.map((fb, index) => (
                        <Fade in={true} timeout={300 + index * 100} key={fb.id}>
                            <Grid item xs={12} md={6} lg={4}>
                                <Card elevation={0} sx={{
                                    borderRadius: 4,
                                    border: '1px solid #e2e8f0',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={fb.role}
                                                size="small"
                                                sx={{
                                                    bgcolor: fb.role === 'PROFESSEUR' ? '#ede9fe' : '#f1f5f9',
                                                    color: fb.role === 'PROFESSEUR' ? '#7c3aed' : '#475569',
                                                    fontWeight: 'bold', fontSize: '0.7rem'
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">{fb.date}</Typography>
                                        </Box>

                                        <Typography variant="h6" fontWeight="bold" gutterBottom>{fb.subject}</Typography>
                                        <Typography variant="body2" color="#64748b" sx={{ mb: 3, minHeight: 60 }}>
                                            "{fb.comment}"
                                        </Typography>

                                        <Divider sx={{ mb: 2 }} />

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#f1f5f9', color: '#64748b' }}>
                                                    <PersonIcon fontSize="small" />
                                                </Avatar>
                                                <Typography variant="subtitle2" fontWeight="bold">{fb.user}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#f59e0b' }}>
                                                <StarIcon fontSize="small" />
                                                <Typography variant="subtitle2" sx={{ ml: 0.5 }}>{fb.rating}/5</Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Fade>
                    ))}
                </Grid>
            </Box>
        );
    }

    // --- VUE ÉLÈVE / PROF ---
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 800, width: '100%' }}>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 2 }}>
                        Votre avis compte pour nous
                    </Typography>
                    <Typography color="#64748b">
                        Une suggestion ? Un bug ? Ou juste un petit mot doux ? <br />
                        Aidez-nous à faire de cette plateforme le meilleur outil pour votre réussite.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', justifyContent: 'center' }}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#7c3aed', color: 'white' }}>
                                <VoiceIcon sx={{ fontSize: 40, mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Impact Direct</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Tous vos retours sont lus personnellement par l'équipe pédagogique et technique.
                                </Typography>
                            </Paper>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                                <FeedbackIcon sx={{ fontSize: 40, mb: 2, color: '#7c3aed' }} />
                                <Typography variant="h6" fontWeight="bold" gutterBottom color="#4c1d95">Transparence</Typography>
                                <Typography variant="body2" color="#64748b">
                                    Nous utilisons vos suggestions pour définir les priorités des prochaines mises à jour.
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                            <form onSubmit={handleSubmit}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                                    Envoyer un feedback
                                </Typography>

                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Note globale</Typography>
                                    <Rating
                                        size="large"
                                        value={formData.rating}
                                        onChange={(e, val) => setFormData({ ...formData, rating: val })}
                                        sx={{ color: '#7c3aed' }}
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    label="Sujet"
                                    required
                                    placeholder="Ex: Amélioration des quiz"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />

                                <TextField
                                    fullWidth
                                    label="Détaillez votre avis"
                                    multiline
                                    required
                                    rows={5}
                                    placeholder="Dites-nous tout..."
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    sx={{
                                        bgcolor: '#7c3aed',
                                        borderRadius: 3,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#6d28d9', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }
                                    }}
                                >
                                    Envoyer le feedback
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%', borderRadius: 3 }}>
                    Merci ! Votre feedback a été transmis avec succès.
                </Alert>
            </Snackbar>
        </Box>
    );
}
