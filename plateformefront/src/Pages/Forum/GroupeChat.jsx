// Components/Groupe/GroupeChat.jsx
import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, AppBar, Toolbar, CircularProgress, Chip } from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon } from '@mui/icons-material';
import { AuthContext } from '../Inscription/AuthContext';
import { getMessages } from '../../ConfigBackEnd/GroupService';
import { connectWebSocket, subscribeToGroupe, sendMessage, disconnectWebSocket } from '../../ConfigBackEnd/WebSocketConfig';

function GroupeChat({ groupeNom, onBack }) {
  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const res = await getMessages(groupeNom);
        setMessages(res.data);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
      } finally { setLoading(false); }
    };

    if (groupeNom) loadMessages();
  }, [groupeNom]);

  useEffect(() => {
    if (!groupeNom) return;

    const _ws = connectWebSocket(
      () => {
        setConnected(true);
        if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
        subscriptionRef.current = subscribeToGroupe(groupeNom, (message) => setMessages(prev => [...prev, message]));
      },
      (error) => {
        console.error('Erreur WebSocket:', error);
        setConnected(false);
      }
    );

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      disconnectWebSocket();
    };
  }, [groupeNom]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !connected) return;
    const success = sendMessage(groupeNom, newMessage);
    if (success) setNewMessage('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    if (date.toDateString() === yesterday.toDateString()) return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2 }}><ArrowBackIcon /></IconButton>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}><GroupIcon /></Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="text.primary">{groupeNom}</Typography>
            <Chip label={connected ? 'Connecté' : 'Déconnecté'} size="small" color={connected ? 'success' : 'error'} sx={{ height: 20 }} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
        {messages.length === 0 ? (
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
                <Box key={message.id || index} sx={{ display: 'flex', flexDirection: isOwnMessage ? 'row-reverse' : 'row', mb: 2, alignItems: 'flex-end' }}>
                  {showAvatar ? (
                    <Avatar sx={{ bgcolor: isOwnMessage ? 'primary.main' : 'grey.400', width: 32, height: 32, fontSize: '0.875rem', mx: 1 }}>
                      {message.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  ) : <Box sx={{ width: 32, mx: 1 }} />}
                  <Box sx={{ maxWidth: '60%' }}>
                    {showAvatar && (
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, ml: isOwnMessage ? 0 : 1, mr: isOwnMessage ? 1 : 0, textAlign: isOwnMessage ? 'right' : 'left', color: isOwnMessage ? 'primary.main' : 'text.secondary', fontWeight: 500 }}>
                        {isOwnMessage ? 'Vous' : message.user.name}
                      </Typography>
                    )}
                    <Paper elevation={1} sx={{ px: 2, py: 1.5, bgcolor: isOwnMessage ? 'primary.main' : 'white', color: isOwnMessage ? 'white' : 'text.primary', borderRadius: 2, ...(isOwnMessage ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 }) }}>
                      <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{message.contenu}</Typography>
                    </Paper>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, ml: isOwnMessage ? 0 : 1, mr: isOwnMessage ? 1 : 0, textAlign: isOwnMessage ? 'right' : 'left', color: 'text.disabled' }}>
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

      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, maxWidth: 800, mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={connected ? "Écrivez votre message..." : "En attente de connexion..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            disabled={!connected}
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <IconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim() || !connected} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '&:disabled': { bgcolor: 'grey.300' } }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default GroupeChat;
