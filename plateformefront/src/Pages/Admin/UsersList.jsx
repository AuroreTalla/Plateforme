import React, { useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Button, Avatar,
    TextField, InputAdornment, Menu, MenuItem, Fade, Tooltip, Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    Email as EmailIcon,
    Block as BlockIcon,
    Delete as DeleteIcon,
    PersonAdd as AddIcon,
    School as StudentIcon,
    MenuBook as ProfIcon
} from '@mui/icons-material';

// Mock data pour les utilisateurs
const mockUsers = [
    { id: 1, name: "Alice Martin", email: "alice@exemple.com", role: "ELEVE", status: "Actif", joinDate: "2023-09-01" },
    { id: 2, name: "Marc Leroy", email: "marc@exemple.com", role: "PROFESSEUR", status: "Actif", joinDate: "2023-05-15" },
    { id: 3, name: "Léa Bernard", email: "lea@exemple.com", role: "ELEVE", status: "Inactif", joinDate: "2023-11-20" },
    { id: 4, name: "Paul Petit", email: "paul@exemple.com", role: "PROFESSEUR", status: "Invité", joinDate: "2024-01-10" },
    { id: 5, name: "Sophie Durant", email: "sophie@exemple.com", role: "ELEVE", status: "Actif", joinDate: "2023-08-12" },
];

export default function UsersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleOpenMenu = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const getStatusChip = (status) => {
        let color = 'default';
        if (status === 'Actif') color = 'success';
        if (status === 'Inactif') color = 'error';
        if (status === 'Invité') color = 'warning';

        return (
            <Chip
                label={status}
                size="small"
                variant="outlined"
                color={color}
                sx={{ fontWeight: 'bold', borderRadius: 1.5 }}
            />
        );
    };

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                        Utilisateurs
                    </Typography>
                    <Typography color="#64748b">
                        Gérez les comptes des élèves et des professeurs de la plateforme.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                        bgcolor: '#7c3aed',
                        borderRadius: 3,
                        px: 3, py: 1.2,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#6d28d9', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }
                    }}
                >
                    Nouvel Utilisateur
                </Button>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: 'white' }}>
                <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="Rechercher par nom ou email..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>
                        }}
                        sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <Tooltip title="Filtrer">
                        <IconButton sx={{ bgcolor: '#f1f5f9', color: '#64748b', borderRadius: 2 }}>
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Utilisateur</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Rôle</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Date d'arrivée</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Statut</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user, index) => (
                                <Fade in={true} timeout={200 + index * 50} key={user.id}>
                                    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{
                                                    bgcolor: user.role === 'PROFESSEUR' ? '#ede9fe' : '#f1f5f9',
                                                    color: user.role === 'PROFESSEUR' ? '#7c3aed' : '#64748b',
                                                    mr: 2, borderRadius: 2
                                                }}>
                                                    {user.role === 'PROFESSEUR' ? <ProfIcon fontSize="small" /> : <StudentIcon fontSize="small" />}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                size="small"
                                                sx={{
                                                    bgcolor: user.role === 'PROFESSEUR' ? '#f5f3ff' : '#f8fafc',
                                                    color: user.role === 'PROFESSEUR' ? '#7c3aed' : '#64748b',
                                                    fontWeight: 600, borderRadius: 1.5, fontSize: '0.7rem'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell color="text.secondary">{user.joinDate}</TableCell>
                                        <TableCell>{getStatusChip(user.status)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => handleOpenMenu(e, user)}>
                                                <MoreIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </Fade>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 160 } }}
            >
                <MenuItem onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1.2 }}>
                    <EmailIcon fontSize="small" sx={{ color: '#64748b' }} /> Envoyer email
                </MenuItem>
                <MenuItem onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1.2 }}>
                    <BlockIcon fontSize="small" sx={{ color: '#f59e0b' }} /> Suspendre
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1.2, color: '#ef4444' }}>
                    <DeleteIcon fontSize="small" /> Supprimer
                </MenuItem>
            </Menu>
        </Box>
    );
}
