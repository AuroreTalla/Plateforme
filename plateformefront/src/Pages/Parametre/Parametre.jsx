import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Avatar, Switch, Divider, IconButton } from '@mui/material';
import {
    Person as PersonIcon,
    Lock as LockIcon,
    Notifications as NotificationsIcon,
    Language as LanguageIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon
} from '@mui/icons-material';

export default function Parametre() {
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#4c1d95' }}>
                Paramètres du Compte
            </Typography>

            <Grid container spacing={4}>
                {/* Section Profil */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    sx={{ width: 100, height: 100, bgcolor: '#f5f3ff', color: '#7c3aed', fontSize: '2rem', fontWeight: 'bold' }}
                                >
                                    UT
                                </Avatar>
                                <IconButton
                                    sx={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        bgcolor: '#7c3aed', color: 'white',
                                        '&:hover': { bgcolor: '#6d28d9' }
                                    }}
                                    size="small"
                                >
                                    <PhotoCameraIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Box sx={{ ml: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Utilisateur Test</Typography>
                                <Typography color="text.secondary">etudiant@exemple.com</Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Prénom" defaultValue="Utilisateur"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Nom" defaultValue="Test"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Email" defaultValue="etudiant@exemple.com"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Bio" multiline rows={3} placeholder="Parlez-nous de vous..."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                sx={{
                                    bgcolor: '#7c3aed',
                                    borderRadius: 3,
                                    px: 4, py: 1.2,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: '#6d28d9' }
                                }}
                            >
                                Sauvegarder les modifications
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Barre Latérale Paramètres */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Sécurité */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LockIcon sx={{ color: '#7c3aed', mr: 1.5 }} />
                                <Typography variant="subtitle1" fontWeight="bold">Sécurité</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Mettez à jour votre mot de passe pour protéger votre compte.
                            </Typography>
                            <Button fullWidth variant="outlined" sx={{ borderRadius: 3, textTransform: 'none', color: '#7c3aed', borderColor: '#7c3aed' }}>
                                Changer de mot de passe
                            </Button>
                        </Paper>

                        {/* Préférences */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <NotificationsIcon sx={{ color: '#7c3aed', mr: 1.5 }} />
                                <Typography variant="subtitle1" fontWeight="bold">Préférences</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="body2">Notifications Email</Typography>
                                <Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} color="secondary" />
                            </Box>

                            <Divider sx={{ my: 1.5 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Mode Sombre</Typography>
                                <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} color="secondary" />
                            </Box>
                        </Paper>

                        {/* Langue */}
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LanguageIcon sx={{ color: '#7c3aed', mr: 1.5 }} />
                                <Typography variant="subtitle1" fontWeight="bold">Langue</Typography>
                            </Box>
                            <TextField select fullWidth SelectProps={{ native: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}>
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                            </TextField>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
