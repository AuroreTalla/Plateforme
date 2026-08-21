import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

/*CONNEXION WEBSOCKET*/
export const connectWebSocket = (onConnected, onError) => {
<<<<<<< HEAD
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';
  const socket = new SockJS(`${backendUrl}/ws`);
=======

  // Éviter plusieurs connexions simultanées
  if (stompClient && stompClient.active) {
    console.log('⚠️ WebSocket déjà actif');
    return stompClient;
  }
>>>>>>> origin/main

  stompClient = new Client({

    // Une nouvelle connexion SockJS pour chaque tentative
    webSocketFactory: () => {
      return new SockJS('http://localhost:8081/ws');
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    /* Connexion STOMP réussie*/
    onConnect: () => {
      console.log('✅ WebSocket connecté');
      console.log(
        'STOMP connected:',
        stompClient.connected
      );

      if (onConnected) {
        onConnected();
      }
    },

    /* Déconnexion*/
    onDisconnect: () => {
      console.log(
        '🔌 WebSocket déconnecté'
      );
    },

    /* Erreur STOMP */
    onStompError: (frame) => {
      console.error(
        '❌ Erreur STOMP:',
        frame
      );

      if (onError) {
        onError(frame);
      }
    },

    /*Erreur WebSocket*/
    onWebSocketError: (error) => {
      console.error(
        '❌ Erreur WebSocket:',
        error
      );

      if (onError) {
        onError(error);
      }
    }
  });

  stompClient.activate();
  return stompClient;
};


/* ABONNEMENT À UN GROUPE */
export const subscribeToGroupe = (
  groupeId,
  callback
) => {

  if (!stompClient || !stompClient.connected) {
    console.warn('⚠️ WebSocket non connecté');
    return null;
  }

<<<<<<< HEAD
  return stompClient.subscribe(`/topic/groupe/${groupeNom}`, (message) => {
    const messageData = JSON.parse(message.body);
    callback(messageData);
=======
  if (!groupeId) {
    console.error('❌ ID du groupe manquant');
    return null;
  }

  console.log(`📡 Abonnement au groupe ID : ${groupeId}`);
  const destination = `/topic/groupe/${groupeId}`;
  console.log(
    '📍 Destination abonnement :',
    destination
  );

  return stompClient.subscribe(
    destination,
    (message) => {
      console.log(
        '📨 Message WebSocket reçu:',
        message.body
      );

      try {
        const messageData =
          JSON.parse(message.body);
        callback(messageData);

      } catch (error) {

        console.error(
          '❌ Erreur parsing message WebSocket:',
          error
        );
      }
    }
  );
};

/* ENVOI D'UN MESSAGE */
export const sendMessage = (
  groupeId,
  content,
  userEmail
) => {
  if (!stompClient || !stompClient.connected) {
    console.error(
      '❌ Impossible d\'envoyer le message : WebSocket non connecté'
    );
    return false;
  }

  if (!groupeId) {
    console.error(
      '❌ ID du groupe manquant'
    );
    return false;
  }

  if (!userEmail) {
    console.error(
      '❌ Email utilisateur manquant'
    );
    return false;
  }

  if (!content?.trim()) {
    console.error(
      '❌ Message vide'
    );
    return false;
  }

  console.log(
    '📤 Envoi message:',
    {
      groupeId,
      content,
      userEmail
    }
  );

  const destination = `/app/sendMessage/${groupeId}`;
  console.log(
    '📍 Destination STOMP:',
    destination
  );
  stompClient.publish({
    destination,
    body: JSON.stringify({
      content: content.trim(),
      userEmail
    })
  });
  return true;
};


/* DÉCONNEXION */
export const disconnectWebSocket = () => {
  if (stompClient) {
    console.log(
      '🔌 Déconnexion WebSocket...'
    );
    stompClient.deactivate();
    stompClient = null;
  }
};


/* RÉCUPÉRER LE CLIENT STOMP */
export const getStompClient = () => {
  return stompClient;
};


/* VÉRIFIER LA CONNEXION */
export const isConnected = () => {
  return !!( stompClient && stompClient.connected);
};

/* ============================================================
   PUBLICATIONS
============================================================ */

/* ABONNEMENT AUX PUBLICATIONS D'UN GROUPE */
export const subscribeToPublications = (groupeId, callback) => {

  if (!stompClient || !stompClient.connected) {
    console.warn('⚠️ WebSocket non connecté');
    return null;
  }

  if (!groupeId) {
    console.error('❌ ID du groupe manquant');
    return null;
  }

  console.log(`📡 Abonnement aux publications du groupe ID : ${groupeId}`);
  const destination = `/topic/groupe/${groupeId}`;
  console.log('📍 Destination abonnement :', destination);

  return stompClient.subscribe(destination, (message) => {
    console.log('📨 Publication WebSocket reçue:', message.body);

    try {
      const publicationData = JSON.parse(message.body);
      callback(publicationData);
    } catch (error) {
      console.error('❌ Erreur parsing publication WebSocket:', error);
    }
>>>>>>> origin/main
  });
};

/* ENVOI D'UNE PUBLICATION */
export const sendPublication = (groupeId, titre, content, userEmail) => {
  if (!stompClient || !stompClient.connected) {
    console.error('❌ Impossible d\'envoyer la publication : WebSocket non connecté');
    return false;
  }

<<<<<<< HEAD
=======
  if (!groupeId) {
    console.error('❌ ID du groupe manquant');
    return false;
  }

>>>>>>> origin/main
  if (!userEmail) {
    console.error('❌ Email utilisateur manquant');
    return false;
  }

<<<<<<< HEAD
  console.log('📤 Envoi message:', { groupeNom, content, userEmail });

  stompClient.publish({
    destination: `/app/sendMessage/${groupeNom}`,
    body: JSON.stringify({
      content,
      userEmail
    })
  });

=======
  if (!titre?.trim() || !content?.trim()) {
    console.error('❌ Titre ou contenu vide');
    return false;
  }

  console.log('📤 Envoi publication:', { groupeId, titre, content, userEmail });

  const destination = `/app/sendpublication/${groupeId}`;
  console.log('📍 Destination STOMP:', destination);

  stompClient.publish({
    destination,
    body: JSON.stringify({
      titre: titre.trim(),
      content: content.trim(),
      userEmail
    })
  });
>>>>>>> origin/main
  return true;
};

/* ============================================================
   RÉPONSES
============================================================ */

/* ABONNEMENT AUX RÉPONSES D'UNE PUBLICATION */
export const subscribeToReponses = (publicationId, callback) => {

  if (!stompClient || !stompClient.connected) {
    console.warn('⚠️ WebSocket non connecté');
    return null;
  }

  if (!publicationId) {
    console.error('❌ ID de la publication manquant');
    return null;
  }

  console.log(`📡 Abonnement aux réponses de la publication ID : ${publicationId}`);
  const destination = `/topic/publication/${publicationId}`;
  console.log('📍 Destination abonnement :', destination);

  return stompClient.subscribe(destination, (message) => {
    console.log('📨 Réponse WebSocket reçue:', message.body);

    try {
      const reponseData = JSON.parse(message.body);
      callback(reponseData);
    } catch (error) {
      console.error('❌ Erreur parsing réponse WebSocket:', error);
    }
  });
};

/* ENVOI D'UNE RÉPONSE */
export const sendReponse = (publicationId, content, userEmail) => {
  if (!stompClient || !stompClient.connected) {
    console.error('❌ Impossible d\'envoyer la réponse : WebSocket non connecté');
    return false;
  }

  if (!publicationId) {
    console.error('❌ ID de la publication manquant');
    return false;
  }

  if (!userEmail) {
    console.error('❌ Email utilisateur manquant');
    return false;
  }

  if (!content?.trim()) {
    console.error('❌ Réponse vide');
    return false;
  }

  console.log('📤 Envoi réponse:', { publicationId, content, userEmail });

  const destination = `/app/sendreponse/${publicationId}`;
  console.log('📍 Destination STOMP:', destination);

  stompClient.publish({
    destination,
    body: JSON.stringify({
      content: content.trim(),
      userEmail
    })
  });
  return true;
};