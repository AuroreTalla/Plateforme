import { useState, useEffect, useRef } from 'react';
import GroupeChat from './GroupeChat';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';
import { Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGroupes } from '../../Composants/Groupe/GroupProvider.jsx';

function Forum() {
  const { sujet } = useParams();
  const { groupes, loading } = useGroupes();

  const [selectedGroupe, setSelectedGroupe] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  const wsInitialized = useRef(false);

  // Recherche du groupe correspondant à l'ID présent dans l'URL
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
      console.log("✅ Groupe trouvé :", groupe);
      setSelectedGroupe(groupe);
    } else {
      console.warn("⚠️ Aucun groupe trouvé pour l'id :", groupeId);
      setSelectedGroupe(null);
    }
  }, [sujet, groupes]);

  // Connexion WebSocket
  useEffect(() => {
    if (wsInitialized.current) {
      return;
    }

    wsInitialized.current = true;

    console.log("🔌 Initialisation WebSocket...");

    connectWebSocket(
      () => {
        console.log("✅ WebSocket connecté");
        setWsConnected(true);
      },
      (error) => {
        console.error("❌ Erreur WebSocket :", error);
        setWsConnected(false);
      }
    );

    return () => {
      console.log("🔌 Déconnexion WebSocket...");
      disconnectWebSocket();
      wsInitialized.current = false;
      setWsConnected(false);
    };
  }, []);

  // Chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Aucun groupe correspondant à l'URL
  if (!selectedGroupe) {
    return (
      <Box sx={{ p: 3 }}>
        Aucun groupe trouvé.
      </Box>
    );
  }

  // Affichage du chat
  return (
    <Box sx={{ height: '100%', minHeight: 0 }}>
      <GroupeChat
        groupeId={selectedGroupe.id}
        groupeNom={selectedGroupe.nom}
        onBack={() => window.history.back()}
        wsConnected={wsConnected}
      />
    </Box>
  );
}

export default Forum;