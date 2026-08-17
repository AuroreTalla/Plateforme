import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Avatar,
    Tooltip, Fade, CircularProgress, Snackbar, Alert
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { getDemandesProfesseur, validerProfesseur, refuserProfesseur } from '../../../ConfigBackEnd/ProfService';
import { formatDate } from '../../../ConfigBackEnd/FormatDate';

export function DemandesProf() {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const loadDemandes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getDemandesProfesseur();
            setDemandes(res.data.demandes);
        } catch (e) {
            console.error('❌ Erreur chargement demandes professeur :', e);
            setSnackbar({ open: true, message: 'Erreur lors du chargement des demandes.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDemandes();
    }, [loadDemandes]);

    const handleValider = async (userId, name) => {
        setProcessingId(userId);
        try {
            await validerProfesseur(userId);
            setDemandes((prev) => prev.filter((d) => d.id !== userId));
            setSnackbar({ open: true, message: `${name} a été validé comme professeur.`, severity: 'success' });
        } catch (e) {
            console.error('❌ Erreur validation :', e);
            setSnackbar({ open: true, message: e.response?.data?.message || 'Erreur lors de la validation.', severity: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleRefuser = async (userId, name) => {
        setProcessingId(userId);
        try {
            await refuserProfesseur(userId);
            setDemandes((prev) => prev.filter((d) => d.id !== userId));
            setSnackbar({ open: true, message: `Demande de ${name} refusée.`, severity: 'info' });
        } catch (e) {
            console.error('❌ Erreur refus :', e);
            setSnackbar({ open: true, message: e.response?.data?.message || 'Erreur lors du refus.', severity: 'error' });
        } finally {
            setProcessingId(null);
        }
    };

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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: '#8b5cf6' }} />
                </Box>
            ) : demandes.length === 0 ? (
                <Typography color="text.secondary">Aucune demande en attente.</Typography>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Candidat</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date d'inscription</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Décision</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {demandes.map((d, index) => (
                                <Fade in={true} timeout={300 + index * 100} key={d.id}>
                                    <TableRow hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed', mr: 2 }}>
                                                    {d.name?.charAt(0)?.toUpperCase() || '?'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">{d.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{d.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {formatDate(d.dateInscription)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <Tooltip title="Accepter">
                                                    <span>
                                                        <IconButton
                                                            disabled={processingId === d.id}
                                                            onClick={() => handleValider(d.id, d.name)}
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
                                                            onClick={() => handleRefuser(d.id, d.name)}
                                                            sx={{ bgcolor: '#fef2f2', color: '#991b1b', '&:hover': { bgcolor: '#fee2e2' } }}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </Fade>
                            ))}
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