import React from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Button, Avatar,
    Tooltip, Fade, Grid, Divider
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon,
    Visibility as ViewIcon,
    Person as PersonIcon,
    Book as BookIcon,
    AccessTime as TimeIcon,
    FactCheck as VerifyIcon
} from '@mui/icons-material';

// Mock data pour les demandes profs
const mockDemandesProf = [
    { id: 1, name: "Dr. Marc Dubois", email: "marc.dubois@mail.com", specialite: "Mathématiques", date: "2024-01-20", cv: "cv_dubois.pdf" },
    { id: 2, name: "Mme Sarah Labbe", email: "sarah.l@mail.com", specialite: "Biologie", date: "2024-01-18", cv: "cv_sarah.pdf" },
];

// Mock data pour les demandes matières
const mockDemandesMatieres = [
    { id: 1, prof: "Prof. Alan Turing", nom: "Cryptographie Avancée", description: "Étude des systèmes de chiffrement modernes.", date: "2024-01-19" },
    { id: 2, prof: "Mme Marie Curie", nom: "Physique Nucléaire", description: "Introduction à la radioactivité et ses applications.", date: "2024-01-17" },
];

export function DemandesProf() {
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

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Candidat</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Spécialité</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Documents</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Décision</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockDemandesProf.map((d, index) => (
                            <Fade in={true} timeout={300 + index * 100} key={d.id}>
                                <TableRow hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: '#ede9fe', color: '#7c3aed', mr: 2 }}>{d.name.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">{d.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{d.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell><Chip label={d.specialite} size="small" variant="outlined" /></TableCell>
                                    <TableCell color="text.secondary">{d.date}</TableCell>
                                    <TableCell>
                                        <Button size="small" startIcon={<ViewIcon />} sx={{ textTransform: 'none', color: '#7c3aed' }}>
                                            Voir CV
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Tooltip title="Accepter">
                                                <IconButton sx={{ bgcolor: '#f0fdf4', color: '#166534', '&:hover': { bgcolor: '#dcfce7' } }}>
                                                    <CheckIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Refuser">
                                                <IconButton sx={{ bgcolor: '#fef2f2', color: '#991b1b', '&:hover': { bgcolor: '#fee2e2' } }}>
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </Fade>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export function DemandesMatieres() {
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                    Nouvelles Matières
                </Typography>
                <Typography color="#64748b">
                    Approuvez les propositions de matières soumises par les professeurs.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {mockDemandesMatieres.map((m, index) => (
                    <Fade in={true} timeout={300 + index * 100} key={m.id}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', position: 'relative' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', mr: 2 }}>
                                        <BookIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">{m.nom}</Typography>
                                        <Typography variant="caption" color="text.secondary">Proposé par {m.prof}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                                    {m.description}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                        <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                                        <Typography variant="caption">{m.date}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="contained" size="small" sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: 2, textTransform: 'none' }}>
                                            Approuver
                                        </Button>
                                        <Button variant="outlined" size="small" sx={{ color: '#ef4444', borderColor: '#ef4444', '&:hover': { borderColor: '#dc2626', bgcolor: '#fef2f2' }, borderRadius: 2, textTransform: 'none' }}>
                                            Rejeter
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    </Fade>
                ))}
            </Grid>
        </Box>
    );
}
