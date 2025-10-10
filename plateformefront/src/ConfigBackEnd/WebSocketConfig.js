// ConfigBackEnd/WebSocketConfig.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectWebSocket = (onConnected, onError) => {
  const socket = new SockJS('http://localhost:8081/ws');
  
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    
    onConnect: () => {
      console.log('✅ WebSocket connecté');
      if (onConnected) onConnected();
    },
    
    onStompError: (frame) => {
      console.error('❌ Erreur STOMP:', frame);
      if (onError) onError(frame);
    },
    
    onWebSocketError: (error) => {
      console.error('❌ Erreur WebSocket:', error);
      if (onError) onError(error);
    }
  });

  stompClient.activate();
  return stompClient;
};

export const subscribeToGroupe = (groupeNom, callback) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('⚠️ WebSocket non connecté');
    return null;
  }

  return stompClient.subscribe(`/topic/groupe/${groupeNom}`, (message) => {
    const messageData = JSON.parse(message.body);
    callback(messageData);
  });
};

export const sendMessage = (groupeNom, contenu) => {
  if (!stompClient || !stompClient.connected) {
    console.error('❌ Impossible d\'envoyer le message : WebSocket non connecté');
    return false;
  }

  stompClient.publish({
    destination: `/app/sendMessage/${groupeNom}`,
    body: JSON.stringify({ contenu })
  });
  
  return true;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    console.log('🔌 WebSocket déconnecté');
  }
};

export const getStompClient = () => stompClient;