import { useState, useEffect, useRef } from 'react';
import GroupeList from './GroupeList';
import GroupeChat from './GroupeChat';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';

function Forum() {
  const [selectedGroupe, setSelectedGroupe] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsInitialized = useRef(false);

  // ✅ Connexion WebSocket UNE SEULE FOIS
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

  return (
    <div>
      {selectedGroupe ? (
        <GroupeChat 
          groupeNom={selectedGroupe} 
          onBack={handleBackToList}
          wsConnected={wsConnected}  // ✅ Passe l'état de connexion
        />
      ) : (
        <GroupeList 
          onSelectGroupe={handleSelectGroupe}
          wsConnected={wsConnected}  // ✅ Passe l'état de connexion
        />
      )}
    </div>
  );
}

export default Forum;