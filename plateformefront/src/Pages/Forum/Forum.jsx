import { useState, useEffect, useRef } from 'react';
import GroupeChat from './GroupeChat';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';
import { Box, Card, CardContent, Typography, Grid, CardActionArea, Avatar } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';

import { useParams } from 'react-router-dom';

function Forum() {
  const { sujet } = useParams(); // Récupère le sujet depuis l'URL
  const [selectedGroupe, setSelectedGroupe] = useState(sujet || null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsInitialized = useRef(false);

  // Mettre à jour si l'URL change
  useEffect(() => {
    if (sujet) {
      setSelectedGroupe(sujet);
    }
  }, [sujet]);

  // Liste des matières disponibles (pourrait venir d'une API)
  const matieres = [
    { nom: "Mathématiques", icon: CalculateIcon, color: "#7c3aed" },
    { nom: "Physique", icon: ScienceIcon, color: "#2563eb" },
    { nom: "Chimie", icon: BiotechIcon, color: "#059669" }
  ];

  useEffect(() => {
    if (wsInitialized.current) return;

    wsInitialized.current = true;

    connectWebSocket(
      () => {
        console.log('✅ WebSocket connecté (Forum)');
        setWsConnected(true);
      },
      (error) => {
        console.error('❌ Erreur WebSocket (Forum):', error);
        setWsConnected(false);
      }
    );

    return () => {
      disconnectWebSocket();
      wsInitialized.current = false;
    };
  }, []);

  const handleSelectGroupe = (groupeNom) => {
    setSelectedGroupe(groupeNom);
  };

  const handleBackToList = () => {
    setSelectedGroupe(null);
  };

  if (selectedGroupe) {
    return (
      <GroupeChat
        groupeNom={selectedGroupe}
        onBack={handleBackToList}
        wsConnected={wsConnected}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#4c1d95' }}>
        Forums par Matière
      </Typography>

      <Grid container spacing={3}>
        {matieres.map((matiere) => {
          const Icon = matiere.icon;
          return (
            <Grid item xs={12} md={4} key={matiere.nom}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardActionArea
                  onClick={() => handleSelectGroupe(matiere.nom)}
                  sx={{ p: 2 }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: `${matiere.color}15`,
                        color: matiere.color,
                        mb: 2
                      }}
                    >
                      <Icon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" align="center">
                      {matiere.nom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      Espace d'échange pour le cours de {matiere.nom}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Forum;