import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, AppBar, Toolbar, CircularProgress, Chip, Button } from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { AuthContext } from "../../Composants/Authentification/AuthContext";
import { getMessages, joinGroupe } from '../../ConfigBackEnd/GroupService';
import { subscribeToGroupe, sendMessage } from '../../ConfigBackEnd/WebSocketConfig';

function GroupeChat({ groupeNom, onBack, wsConnected }) {
  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);  // ✅ Changé de "joined" à "isMember"
  const [joining, setJoining] = useState(false);

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  // ✅ NOUVEAU : Vérifier si l'utilisateur est membre (sans rejoindre automatiquement)
  useEffect(() => {
    const checkMember = async () => {
      try {
        setLoading(true);
        
        // Essayer de charger les messages
        try {
          const res = await getMessages(groupeNom);
          setMessages(res.data);
          setIsMember(true); // Si ça marche, on est membre
          console.log(`✅ Membre du groupe, ${res.data.length} messages chargés`);
        } catch (error) {
          // Si erreur 403/401, on n'est pas membre
          if (error.response?.status === 403 || error.response?.status === 401) {
            setIsMember(false);
            console.log('⚠️ Non membre du groupe');
          } else {
            throw error; // Autre erreur
          }
        }
        
      } catch (error) {
        console.error('❌ Erreur vérification:', error);
      } finally { 
        setLoading(false); 
      }
    };

    if (groupeNom) checkMember();
  }, [groupeNom]);

  // ✅ S'abonner au WebSocket seulement si membre
  useEffect(() => {
    if (!groupeNom || !wsConnected || !isMember) return;

    console.log(`📡 Abonnement au groupe: ${groupeNom}`);
    
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = subscribeToGroupe(groupeNom, (message) => {
      console.log('💬 Message reçu:', message);
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (subscriptionRef.current) {
        console.log(`🔌 Désabonnement du groupe: ${groupeNom}`);
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [groupeNom, wsConnected, isMember]);

  // ✅ NOUVEAU : Fonction pour rejoindre le groupe
  const handleJoinGroupe = async () => {
  try {
    setJoining(true);
    
    // 1️⃣ Rejoindre le groupe
    await joinGroupe(groupeNom);
    console.log(`✅ Rejoint le groupe: ${groupeNom}`);
    
    // 2️⃣ Petit délai pour s'assurer que la transaction est commitée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // 3️⃣ Recharger les messages
    const res = await getMessages(groupeNom);
    setMessages(res.data);
    setIsMember(true);
    
    console.log(`✅ ${res.data.length} messages chargés`);
    
  } catch (error) {
    console.error('❌ Erreur rejoindre groupe:', error);
    
    if (error.response?.status === 403) {
      alert('Vous devez être membre du groupe pour voir les messages');
    } else {
      alert('Impossible de rejoindre le groupe');
    }
  } finally {
    setJoining(false);
  }
};

  const handleSendMessage = () => {
    if (!newMessage.trim() || !wsConnected || !isMember) {
      console.warn('⚠️ Impossible d\'envoyer:', { wsConnected, isMember, hasContent: !!newMessage.trim() });
      return;
    }
    
    if (!currentUser?.email) {
      console.error('❌ Email utilisateur manquant');
      return;
    }
    
    console.log('📤 Envoi message:', { groupeNom, newMessage, userEmail: currentUser.email });
    const success = sendMessage(groupeNom, newMessage, currentUser.email);
    
    if (success) {
      setNewMessage('');
      console.log('✅ Message envoyé avec succès');
    } else {
      console.error('❌ Échec envoi message');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today); 
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <GroupIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="text.primary">{groupeNom}</Typography>
            <Chip 
              label={isMember ? (wsConnected ? 'Connecté' : 'Déconnecté') : 'Non membre'} 
              size="small" 
              color={isMember ? (wsConnected ? 'success' : 'warning') : 'default'} 
              sx={{ height: 20 }} 
            />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
        {/* ✅ NOUVEAU : Afficher bouton "Rejoindre" si pas membre */}
        {!isMember ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <GroupIcon sx={{ fontSize: 80, mb: 3, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom>
              Rejoindre {groupeNom}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 400 }}>
              Vous devez rejoindre ce groupe pour voir et envoyer des messages
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={handleJoinGroupe}
              disabled={joining}
              sx={{ px: 4, py: 1.5 }}
            >
              {joining ? 'Rejoindre en cours...' : 'Rejoindre le groupe'}
            </Button>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
            <GroupIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>Aucun message pour le moment</Typography>
            <Typography variant="body2">Soyez le premier à envoyer un message !</Typography>
          </Box>
        ) : (
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {messages.map((message, index) => {
              const isOwnMessage = message.user.email === currentUser?.email;
              const showAvatar = index === 0 || messages[index - 1].user.email !== message.user.email;
              
              return (
                <Box 
                  key={message.id || index} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row', 
                    mb: 2, 
                    alignItems: 'flex-end' 
                  }}
                >
                  {showAvatar ? (
                    <Avatar 
                      sx={{ 
                        bgcolor: isOwnMessage ? 'primary.main' : 'grey.400', 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.875rem', 
                        mx: 1 
                      }}
                    >
                      {message.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : (
                    <Box sx={{ width: 32, mx: 1 }} />
                  )}
                  
                  <Box sx={{ maxWidth: '60%' }}>
                    {showAvatar && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mb: 0.5, 
                          ml: isOwnMessage ? 0 : 1, 
                          mr: isOwnMessage ? 1 : 0, 
                          textAlign: isOwnMessage ? 'right' : 'left', 
                          color: isOwnMessage ? 'primary.main' : 'text.secondary', 
                          fontWeight: 500 
                        }}
                      >
                        {isOwnMessage ? 'Vous' : message.user.name}
                      </Typography>
                    )}
                    
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        px: 2, 
                        py: 1.5, 
                        bgcolor: isOwnMessage ? 'primary.main' : 'white', 
                        color: isOwnMessage ? 'white' : 'text.primary', 
                        borderRadius: 2, 
                        ...(isOwnMessage ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }) 
                      }}
                    >
                      <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                        {message.content}
                      </Typography>
                    </Paper>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 0.5, 
                        ml: isOwnMessage ? 0 : 1, 
                        mr: isOwnMessage ? 1 : 0, 
                        textAlign: isOwnMessage ? 'right' : 'left', 
                        color: 'text.disabled' 
                      }}
                    >
                      {formatDate(message.dateEnvoie)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* ✅ NOUVEAU : Afficher zone de saisie seulement si membre */}
      {isMember && (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, maxWidth: 800, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={wsConnected ? "Écrivez votre message..." : "En attente de connexion..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSendMessage(); 
                } 
              }}
              disabled={!wsConnected}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || !wsConnected} 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                '&:hover': { bgcolor: 'primary.dark' }, 
                '&:disabled': { bgcolor: 'grey.300' } 
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default GroupeChat;