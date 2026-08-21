import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { connectWebSocket, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';
import PublicationList from './PublicationList';

function Forum() {
  const { sujet } = useParams();
  const groupeId = Number(sujet);

  const [wsConnected, setWsConnected] = useState(false);
  const wsInitialized = useRef(false);

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

  if (!sujet || Number.isNaN(groupeId)) {
    return <div className="p-6 text-gray-500">Sélectionnez un forum dans le menu.</div>;
  }

  return (
    <div className="h-full min-h-0">
      <PublicationList groupeId={groupeId} wsConnected={wsConnected} />
    </div>
  );
}

export default Forum;