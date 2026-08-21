import { useState, useContext } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from '@mui/material';
import { Lock as LockIcon, Save as SaveIcon } from '@mui/icons-material';
import { AuthContext } from '../../Composants/Authentification/AuthContext';
import { modifierProfil, changerMotDePasse } from '../../ConfigBackEnd/UserService';

export default function Parametre() {
    const { currentUser, setCurrentUser } = useContext(AuthContext);

    const [name, setName] = useState(currentUser?.name || '');
    const [saving, setSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState(null);

    const [pwdDialogOpen, setPwdDialogOpen] = useState(false);
    const [ancienMdp, setAncienMdp] = useState('');
    const [nouveauMdp, setNouveauMdp] = useState('');
    const [confirmMdp, setConfirmMdp] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);

    const handleSaveProfile = async () => {
        setSaving(true);
        setProfileMsg(null);
        try {
            const res = await modifierProfil(name);
            setCurrentUser(res.data);
            setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès.' });
        } catch (e) {
            setProfileMsg({ type: 'error', text: e.response?.data?.message || 'Erreur lors de la mise à jour.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setPwdError('');

        if (nouveauMdp !== confirmMdp) {
            setPwdError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (nouveauMdp.length < 8) {
            setPwdError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        setPwdLoading(true);
        try {
            await changerMotDePasse(ancienMdp, nouveauMdp);
            setPwdDialogOpen(false);
            setAncienMdp('');
            setNouveauMdp('');
            setConfirmMdp('');
        } catch (e) {
            setPwdError(e.response?.data?.message || 'Erreur lors du changement de mot de passe.');
        } finally {
            setPwdLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#4c1d95' }}>
                Paramètres du Compte
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Avatar sx={{ width: 100, height: 100, bgcolor: '#f5f3ff', color: '#7c3aed', fontSize: '2rem', fontWeight: 'bold' }}>
                                {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box sx={{ ml: 3 }}>
                                <Typography variant="h6" fontWeight="bold">{currentUser.name}</Typography>
                                <Typography color="text.secondary">{currentUser.email}</Typography>
                                <Typography variant="caption" color="text.secondary">{currentUser.statut}</Typography>
                            </Box>
                        </Box>

                        {profileMsg && (
                            <Alert severity={profileMsg.type} sx={{ mb: 3 }}>{profileMsg.text}</Alert>
                        )}

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={currentUser.email}
                                    disabled
                                    helperText="L'email ne peut pas être modifié pour l'instant."
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                                onClick={handleSaveProfile}
                                disabled={saving}
                                sx={{ bgcolor: '#7c3aed', borderRadius: 3, px: 4, py: 1.2, textTransform: 'none', '&:hover': { bgcolor: '#6d28d9' } }}
                            >
                                Sauvegarder les modifications
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LockIcon sx={{ color: '#7c3aed', mr: 1.5 }} />
                            <Typography variant="subtitle1" fontWeight="bold">Sécurité</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Mettez à jour votre mot de passe pour protéger votre compte.
                        </Typography>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setPwdDialogOpen(true)}
                            sx={{ borderRadius: 3, textTransform: 'none', color: '#7c3aed', borderColor: '#7c3aed' }}
                        >
                            Changer de mot de passe
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={pwdDialogOpen} onClose={() => setPwdDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Changer de mot de passe</DialogTitle>
                <DialogContent>
                    {pwdError && <Alert severity="error" sx={{ mb: 2 }}>{pwdError}</Alert>}
                    <TextField
                        fullWidth
                        type="password"
                        label="Mot de passe actuel"
                        value={ancienMdp}
                        onChange={(e) => setAncienMdp(e.target.value)}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Nouveau mot de passe"
                        value={nouveauMdp}
                        onChange={(e) => setNouveauMdp(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Confirmer le nouveau mot de passe"
                        value={confirmMdp}
                        onChange={(e) => setConfirmMdp(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPwdDialogOpen(false)} disabled={pwdLoading}>Annuler</Button>
                    <Button onClick={handleChangePassword} disabled={pwdLoading} variant="contained" sx={{ bgcolor: '#7c3aed' }}>
                        {pwdLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirmer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}