import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Button, Tab, Tabs,
    TablePagination, InputAdornment, TextField, Fade, Grid
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    RequestPage as RequestIcon,
    Schedule as PendingIcon,
    CheckCircle as ValidatedIcon,
    Cancel as RejectedIcon,
    Launch as LaunchIcon
} from '@mui/icons-material';

// Mock data pour les demandes
const mockDemandes = [
    { id: 1, type: "Matériel", objet: "Vidéoprojecteur - Salle 204", date: "2024-01-20", statut: "En attente", priorite: "Haute" },
    { id: 2, type: "Matière", objet: "Création : Informatique Quantique", date: "2024-01-18", statut: "Validé", priorite: "Moyenne" },
    { id: 3, type: "Matériel", objet: "Squelette anatomique", date: "2024-01-15", statut: "Refusé", priorite: "Basse" },
    { id: 4, type: "Matière", objet: "Ajout : Histoire de l'Art", date: "2024-01-10", statut: "Validé", priorite: "Moyenne" },
];

export default function MesDemandes() {
    const [tab, setTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusChip = (status) => {
        const config = {
            'En attente': { color: 'warning', icon: <PendingIcon fontSize="small" />, bg: '#fff7ed', text: '#9a3412' },
            'Validé': { color: 'success', icon: <ValidatedIcon fontSize="small" />, bg: '#f0fdf4', text: '#166534' },
            'Refusé': { color: 'error', icon: <RejectedIcon fontSize="small" />, bg: '#fef2f2', text: '#991b1b' },
        };
        const style = config[status] || config['En attente'];
        return (
            <Chip
                label={status}
                size="small"
                icon={style.icon}
                sx={{ bgcolor: style.bg, color: style.text, fontWeight: 'bold', border: `1px solid ${style.text}33` }}
            />
        );
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const filteredDemandes = mockDemandes
        .filter(d => d.objet.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                        Mes Demandes
                    </Typography>
                    <Typography color="#64748b">
                        Suivez l'état de vos demandes de matériel et de matières.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        bgcolor: '#7c3aed',
                        borderRadius: 3,
                        px: 3, py: 1,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#6d28d9', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }
                    }}
                >
                    Nouvelle Demande
                </Button>
            </Box>

            {/* Statistiques rapides */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Totales', val: 12, color: '#7c3aed', bg: '#f5f3ff' },
                    { label: 'En attente', val: 3, color: '#f59e0b', bg: '#fff7ed' },
                    { label: 'Validées', val: 8, color: '#10b981', bg: '#f0fdf4' }
                ].map((stat, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: 'white', display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: stat.bg, color: stat.color, mr: 2 }}>
                                <RequestIcon />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="bold">{stat.val}</Typography>
                                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: 'white' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Rechercher une demande..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>
                        }}
                        sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        sx={{
                            '& .MuiTabs-indicator': { bgcolor: '#7c3aed' },
                            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, color: '#64748b' },
                            '& .Mui-selected': { color: '#7c3aed !important' }
                        }}
                    >
                        <Tab label="Tout" />
                        <Tab label="Matériel" />
                        <Tab label="Matière" />
                    </Tabs>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Objet</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Priorité</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }} align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDemandes.map((d, index) => (
                                <Fade in={true} timeout={200 + index * 100} key={d.id}>
                                    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Chip label={d.type} size="small" variant="outlined" sx={{ fontWeight: 500, borderRadius: 1.5 }} />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{d.objet}</TableCell>
                                        <TableCell color="text.secondary">{d.date}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{
                                                color: d.priorite === 'Haute' ? '#ef4444' : d.priorite === 'Moyenne' ? '#f59e0b' : '#3b82f6',
                                                fontWeight: 600
                                            }}>
                                                {d.priorite}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getStatusChip(d.statut)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#7c3aed' } }}>
                                                <LaunchIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </Fade>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={mockDemandes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                />
            </Paper>
        </Box>
    );
}
