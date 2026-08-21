import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, IconButton, Avatar,
    TextField, InputAdornment, Menu, MenuItem, Fade, Tooltip, CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreIcon,
    School as StudentIcon,
    MenuBook as ProfIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { getAllUsers } from '../../ConfigBackEnd/UserService';
import { formatDate } from '../../ConfigBackEnd/FormatDate';

const roleConfig = {
    ELEVE: { icon: StudentIcon, bg: '#f1f5f9', color: '#64748b' },
    PROFESSEUR: { icon: ProfIcon, bg: '#ede9fe', color: '#7c3aed' },
    ADMIN: { icon: AdminIcon, bg: '#fef3c7', color: '#92400e' },
};

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (e) {
            console.error('❌ Erreur chargement utilisateurs :', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleOpenMenu = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const getStatusChip = (emailVerifie) => (
        <Chip
            label={emailVerifie ? 'Vérifié' : 'Non vérifié'}
            size="small"
            variant="outlined"
            color={emailVerifie ? 'success' : 'warning'}
            sx={{ fontWeight: 'bold', borderRadius: 1.5 }}
        />
    );

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#4c1d95', mb: 1 }}>
                    Utilisateurs
                </Typography>
                <Typography color="#64748b">
                    Gérez les comptes des élèves et des professeurs de la plateforme.
                </Typography>
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress sx={{ color: '#7c3aed' }} />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Utilisateur</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Rôle</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Date d'arrivée</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#475569' }} align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers.map((user, index) => {
                                    const config = roleConfig[user.statut] || roleConfig.ELEVE;
                                    const RoleIcon = config.icon;
                                    return (
                                        <Fade in={true} timeout={200 + index * 50} key={user.id}>
                                            <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar sx={{ bgcolor: config.bg, color: config.color, mr: 2, borderRadius: 2 }}>
                                                            <RoleIcon fontSize="small" />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.statut}
                                                        size="small"
                                                        sx={{ bgcolor: config.bg, color: config.color, fontWeight: 600, borderRadius: 1.5, fontSize: '0.7rem' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>{formatDate(user.dateInscription)}</TableCell>
                                                <TableCell>{getStatusChip(user.emailVerifie)}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, user)}>
                                                        <MoreIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        </Fade>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            Aucun utilisateur trouvé.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 160 } }}
            >
                <MenuItem onClick={handleCloseMenu} sx={{ gap: 1.5, py: 1.2 }}>
                    Détails à venir
                </MenuItem>
            </Menu>
        </Box>
    );
}