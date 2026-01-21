import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CardActionArea, Typography, Avatar, Chip, CircularProgress, TextField, InputAdornment, Grid, Alert, Fade } from '@mui/material';
import { Search as SearchIcon, Group as GroupIcon, Chat as ChatIcon } from '@mui/icons-material';
import { getAllGroupes } from '../../ConfigBackEnd/GroupService';
import GroupeChat from '../../Pages/Forum/GroupeChat';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';

export default function ForumsAdmin() {
    const [groupes, setGroupes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroupe, setSelectedGroupe] = useState(null);
    const [error, setError] = useState(null);
    const [wsConnected, setWsConnected] = useState(false);
    const wsInitialized = useRef(false);

    useEffect(() => {
        loadGroupes();
        if (!wsInitialized.current) {
            wsInitialized.current = true;
            connectWebSocket(
                () => setWsConnected(true),
                () => setWsConnected(false)
            );
        }
        return () => {
            disconnectWebSocket();
            wsInitialized.current = false;
        };
    }, []);

    const loadGroupes = async () => {
        try {
            setLoading(true);
            const res = await getAllGroupes();
            setGroupes(res.data);
        } catch (error) {
            console.error('Erreur chargement groupes:', error);
            setError('Impossible de charger la liste des groupes');
        } finally {
            setLoading(false);
        }
    };

    const filteredGroupes = groupes.filter(groupe =>
        groupe.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedGroupe) {
        return (
            <GroupeChat
                groupeNom={selectedGroupe}
                onBack={() => setSelectedGroupe(null)}
                wsConnected={wsConnected}
            />
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress sx={{ color: '#7c3aed' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#4c1d95' }}>
                    Administration des Forums
                </Typography>
                <Typography color="#64748b" sx={{ mb: 4 }}>
                    Supervision et modération de tous les espaces de discussion.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <TextField
                    fullWidth
                    placeholder="Rechercher un groupe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        bgcolor: 'white',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                            '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
                        }
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {filteredGroupes.map((groupe, index) => (
                    <Fade in={true} timeout={300 + index * 50} key={groupe.id}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card elevation={0} sx={{
                                height: '100%',
                                borderRadius: 4,
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px -10px rgba(124, 58, 237, 0.2)', borderColor: '#7c3aed' }
                            }}>
                                <CardActionArea
                                    onClick={() => setSelectedGroupe(groupe.nom)}
                                    sx={{ height: '100%', p: 1 }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar sx={{ width: 56, height: 56, bgcolor: '#f5f3ff', color: '#7c3aed', mr: 2, borderRadius: 3 }}>
                                                <GroupIcon />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" color="#1e293b">{groupe.nom}</Typography>
                                                <Chip
                                                    label={`${groupe.nombreMembres || 0} membres`}
                                                    size="small"
                                                    sx={{ mt: 0.5, bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }}
                                                />
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{
                                            mb: 3,
                                            color: '#64748b',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            height: 40
                                        }}>
                                            {groupe.description || "Aucune description disponible."}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                            <ChatIcon sx={{ fontSize: 18, mr: 1, color: '#7c3aed' }} />
                                            <Typography variant="body2" color="#7c3aed" fontWeight="bold">
                                                Accéder au chat
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Fade>
                ))}
                {filteredGroupes.length === 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <GroupIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                            <Typography color="text.secondary">Aucun groupe trouvé.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
