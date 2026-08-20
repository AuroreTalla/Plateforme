import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Avatar,
    Tooltip, Fade, CircularProgress, Snackbar, Alert, Tabs, Tab, Chip
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { getDemandesProfesseur, getHistoriqueProfesseur, validerProfesseur,
     refuserProfesseur, revoquerProfesseur } from '../../../ConfigBackEnd/ProfService';
import { formatDate } from '../../../ConfigBackEnd/FormatDate';

const statutConfig = {
    EN_ATTENTE: { label: 'En attente', color: '#92400e', bg: '#fef3c7' },
    VALIDEE: { label: 'Validée', color: '#166534', bg: '#dcfce7' },
    REFUSEE: { label: 'Refusée', color: '#991b1b', bg: '#fee2e2' },
    REVOQUEE: { label: 'Révoquée', color: '#475569', bg: '#f1f5f9' },
};

export function DemandesProf() {
    const [tab, setTab] = useState('en-attente'); // 'en-attente' | 'toutes'
    const [demandes, setDemandes] = useState([]);
    const [historique, setHistorique] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const loadAll = useCallback(async () => {
        try {
            setLoading(true);
            const [enAttenteRes, historiqueRes] = await Promise.all([
                getDemandesProfesseur(),
                getHistoriqueProfesseur()
            ]);
            setDemandes(enAttenteRes.data.demandes);
            setHistorique(historiqueRes.data.historique);
        } catch (e) {
            console.error('❌ Erreur chargement demandes professeur :', e);
            setSnackbar({ open: true, message: 'Erreur lors du chargement des demandes.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleValider = async (demandeId, name) => {
        setProcessingId(demandeId);
        try {
            await validerProfesseur(demandeId);
            await loadAll(); // recharge les deux listes pour rester cohérent
            setSnackbar({ open: true, message: `${name} a été validé comme professeur.`, severity: 'success' });
        } catch (e) {
            console.error('❌ Erreur validation :', e);
            setSnackbar({ open: true, message: e.response?.data?.message || 'Erreur lors de la validation.', severity: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleRefuser = async (demandeId, name) => {
        setProcessingId(demandeId);
        try {
            await refuserProfesseur(demandeId);
            await loadAll();
            setSnackbar({ open: true, message: `Demande de ${name} refusée.`, severity: 'info' });
        } catch (e) {
            console.error('❌ Erreur refus :', e);
            setSnackbar({ open: true, message: e.response?.data?.message || 'Erreur lors du refus.', severity: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleRevoquer = async (demandeId, name) => {
    setProcessingId(demandeId);
    try {
        await revoquerProfesseur(demandeId);
        await loadAll();
        setSnackbar({ open: true, message: `Statut professeur révoqué pour ${name}.`, severity: 'warning' });
    } catch (e) {
        console.error('❌ Erreur révocation :', e);
        setSnackbar({ open: true, message: e.response?.data?.message || 'Erreur lors de la révocation.', severity: 'error' });
    } finally {
        setProcessingId(null);
    }
};

    const rows = tab === 'en-attente' ? demandes : historique;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                    Inscriptions Professeurs
                </Typography>
                <Typography color="#64748b">
                    Validez les demandes d'inscription des nouveaux enseignants.
                </Typography>
            </Box>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ mb: 3, borderBottom: '1px solid #e2e8f0' }}
            >
                <Tab value="en-attente" label={`En attente (${demandes.length})`} />
                <Tab value="toutes" label={`Historique (${historique.length})`} />
            </Tabs>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: '#8b5cf6' }} />
                </Box>
            ) : rows.length === 0 ? (
                <Typography color="text.secondary">
                    {tab === 'en-attente' ? 'Aucune demande en attente.' : 'Aucun historique.'}
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Candidat</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    {tab === 'en-attente' ? "Date d'inscription" : 'Date de décision'}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">
    {tab === 'en-attente' ? 'Décision' : 'Action'}
</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((d, index) => {
                                const config = statutConfig[d.statut] || statutConfig.EN_ATTENTE;
                                return (
                                    <Fade in={true} timeout={300 + index * 100} key={d.id}>
                                        <TableRow hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed', mr: 2 }}>
                                                        {d.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">{d.user?.name || 'Nom inconnu'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{d.user?.email || 'Email inconnu'}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={config.label}
                                                    size="small"
                                                    sx={{ bgcolor: config.bg, color: config.color, fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>
                                                {tab === 'en-attente'
                                                    ? formatDate(d.user?.dateInscription)
                                                    : formatDate(d.dateValidation)}
                                            </TableCell>
                                            <TableCell align="right">
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {tab === 'en-attente' && (
            <>
                <Tooltip title="Accepter">
                    <span>
                        <IconButton
                            disabled={processingId === d.id}
                            onClick={() => handleValider(d.id, d.user?.name)}
                            sx={{ bgcolor: '#f0fdf4', color: '#166534', '&:hover': { bgcolor: '#dcfce7' } }}
                        >
                            <CheckIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Refuser">
                    <span>
                        <IconButton
                            disabled={processingId === d.id}
                            onClick={() => handleRefuser(d.id, d.user?.name)}
                            sx={{ bgcolor: '#fef2f2', color: '#991b1b', '&:hover': { bgcolor: '#fee2e2' } }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            </>
        )}

        {tab === 'toutes' && d.statut === 'VALIDEE' && (
            <Tooltip title="Révoquer le statut professeur">
                <span>
                    <IconButton
                        disabled={processingId === d.id}
                        onClick={() => handleRevoquer(d.id, d.user?.name)}
                        sx={{ bgcolor: '#fff7ed', color: '#9a3412', '&:hover': { bgcolor: '#ffedd5' } }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
        )}
    </Box>
</TableCell>
                                        </TableRow>
                                    </Fade>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default DemandesProf;