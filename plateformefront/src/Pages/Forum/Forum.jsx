import { useState, useEffect, useRef } from 'react';
import GroupeChat from './GroupeChat';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';
import { Box, Card, CardContent, Typography, Grid, CardActionArea, Avatar, CircularProgress } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import BiotechIcon from '@mui/icons-material/Biotech';
import { useParams } from 'react-router-dom';
import { useGroupes } from '../../Composants/Groupe/GroupProvider.jsx';

function Forum() {

  const { sujet } = useParams();
  const { groupes, loading } = useGroupes();

  const [selectedGroupe, setSelectedGroupe] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  const wsInitialized = useRef(false);

  // Sélection du groupe depuis l'URL (id numérique)
  useEffect(() => {

    if (!sujet || groupes.length === 0) {
      return;
    }

    const groupeId = Number(sujet);

    if (Number.isNaN(groupeId)) {
      console.warn("⚠️ Paramètre 'sujet' invalide :", sujet);
      return;
    }

    const groupe = groupes.find(
      (g) => Number(g.id) === groupeId
    );

    if (groupe) {
      console.log("✅ Groupe trouvé depuis l'URL :", groupe);
      setSelectedGroupe(groupe);
    } else {
      console.warn("⚠️ Aucun groupe trouvé pour l'id :", groupeId);
    }

  }, [sujet, groupes]);

  // Connexion WebSocket
  useEffect(() => {

    if (wsInitialized.current) {
      return;
    }

    wsInitialized.current = true;

    connectWebSocket(
      () => setWsConnected(true),
      (error) => {
        console.error("❌ Erreur WebSocket (Forum) :", error);
        setWsConnected(false);
      }
    );

    return () => {
      disconnectWebSocket();
      wsInitialized.current = false;
      setWsConnected(false);
    };

  }, []);

  const handleSelectGroupe = (groupe) => {
    setSelectedGroupe(groupe);
  };

  const handleBackToList = () => {
    setSelectedGroupe(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (selectedGroupe) {
    return (
      <div className="h-full min-h-0">
        <GroupeChat
          groupeId={selectedGroupe.id}
          groupeNom={selectedGroupe.nom}
          onBack={handleBackToList}
          wsConnected={wsConnected}
        />
      </div>
    );
  }

  const getMatiereConfig = (nom) => {
    switch (nom) {
      case "Mathématiques": return { icon: CalculateIcon, color: "#7c3aed" };
      case "Physique": return { icon: ScienceIcon, color: "#2563eb" };
      case "Chimie": return { icon: BiotechIcon, color: "#059669" };
      default: return { icon: ScienceIcon, color: "#64748b" };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: '#4c1d95' }}>
        Forums par Matière
      </Typography>

      <Grid container spacing={3}>
        {groupes.map((groupe) => {
          const config = getMatiereConfig(groupe.nom);
          const Icon = config.icon;

          return (
            <Grid item xs={12} md={4} key={groupe.id}>
              <Card
                elevation={3}
                sx={{ borderRadius: 4, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}
              >
                <CardActionArea onClick={() => handleSelectGroupe(groupe)} sx={{ p: 2 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ width: 80, height: 80, bgcolor: `${config.color}15`, color: config.color, mb: 2 }}>
                      <Icon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" align="center">{groupe.nom}</Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                      Espace d'échange pour le cours de {groupe.nom}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Groupe #{groupe.id}
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