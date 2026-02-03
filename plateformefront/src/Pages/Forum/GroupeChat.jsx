import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Avatar, AppBar, Toolbar, CircularProgress, Chip, Button, Fade } from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon, Group as GroupIcon, PersonAdd as PersonAddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { AuthContext } from "../../Composants/Authentification/AuthContext";
import { getMessages, joinGroupe } from '../../ConfigBackEnd/GroupService';
import { subscribeToGroupe, sendMessage } from '../../ConfigBackEnd/WebSocketConfig';

function GroupeChat({ groupeNom, onBack, wsConnected }) {
  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const checkMember = async () => {
      try {
        setLoading(true);
        try {
          const res = await getMessages(groupeNom);
          setMessages(res.data);
          setIsMember(true);
        } catch (error) {
          if (error.response?.status === 403 || error.response?.status === 401) {
            setIsMember(false);
          } else {
            throw error;
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

  useEffect(() => {
    if (!groupeNom || !wsConnected || !isMember) return;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = subscribeToGroupe(groupeNom, (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [groupeNom, wsConnected, isMember]);

  const handleJoinGroupe = async () => {
    try {
      setJoining(true);
      await joinGroupe(groupeNom);
      await new Promise(resolve => setTimeout(resolve, 200));
      const res = await getMessages(groupeNom);
      setMessages(res.data);
      setIsMember(true);
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
    if (!newMessage.trim() || !wsConnected || !isMember) return;
    if (!currentUser?.email) return;

    const success = sendMessage(groupeNom, newMessage, currentUser.email);
    if (success) {
      setNewMessage('');
    }
  };

  const formatDate = (dateString) => {
    try {
      // ✅ Parser la date ISO du backend
      const date = new Date(dateString);

      // ✅ Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        console.error('Date invalide:', dateString);
        return 'Date invalide';
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Aujourd'hui : afficher seulement l'heure
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }

      // Hier : afficher "Hier" + heure
      if (date.toDateString() === yesterday.toDateString()) {
        return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      }

      // Autre jour : afficher date + heure
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur formatage date:', error, dateString);
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f3f4f6' }}>
        <CircularProgress sx={{ color: '#8b5cf6' }} size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f8fafc' }}>
      {/* Header Premium Violet */}
      <AppBar position="static" elevation={0} sx={{
        background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
        color: 'white',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        boxShadow: '0 4px 20px -5px rgba(109, 40, 217, 0.4)'
      }}>
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <IconButton edge="start" onClick={onBack} sx={{ mr: 2, color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ArrowBackIcon />
          </IconButton>

          <Avatar sx={{
            bgcolor: 'white',
            color: '#7c3aed',
            mr: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontWeight: 'bold'
          }}>
            {groupeNom.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{groupeNom}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: isMember && wsConnected ? '#4ade80' : '#fb7185',
                boxShadow: isMember && wsConnected ? '0 0 8px #4ade80' : 'none'
              }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {isMember ? (wsConnected ? 'En ligne' : 'Connexion...') : 'Aperçu'}
              </Typography>
            </Box>
          </Box>

          <IconButton size="small" sx={{ color: 'white', opacity: 0.8 }}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column' }}>
        {!isMember ? (
          <Fade in={true} timeout={800}>
            <Paper elevation={0} sx={{
              p: 4,
              maxWidth: 400,
              mx: 'auto',
              mt: 8,
              textAlign: 'center',
              borderRadius: 4,
              bgcolor: 'white',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)'
            }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#f5f3ff', color: '#7c3aed', mx: 'auto', mb: 2 }}>
                <GroupIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="#1e293b" gutterBottom>
                Rejoindre {groupeNom}
              </Typography>
              <Typography color="#64748b" sx={{ mb: 4 }}>
                Rejoignez la discussion pour échanger avec votre classe et vos professeurs.
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PersonAddIcon />}
                onClick={handleJoinGroupe}
                disabled={joining}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  bgcolor: '#7c3aed',
                  '&:hover': { bgcolor: '#6d28d9', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' },
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {joining ? 'Connexion en cours...' : 'Rejoindre le groupe'}
              </Button>
            </Paper>
          </Fade>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
            <GroupIcon sx={{ fontSize: 64, mb: 2, color: '#cbd5e1' }} />
            <Typography variant="h6" color="#94a3b8">Aucun message</Typography>
            <Typography variant="body2" color="#94a3b8">Lancez la discussion !</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            {messages.map((message, index) => {
              const isOwnMessage = message.user.email === currentUser?.email;
              const showAvatar = index === 0 || messages[index - 1].user.email !== message.user.email;

              return (
                <Fade in={true} key={message.id || index}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1.5
                  }}>
                    {showAvatar ? (
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        bgcolor: isOwnMessage ? '#7c3aed' : '#e2e8f0',
                        color: isOwnMessage ? 'white' : '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {message.user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    ) : (
                      <Box sx={{ width: 32 }} />
                    )}

                    <Box sx={{ maxWidth: '70%' }}>
                      {showAvatar && !isOwnMessage && (
                        <Typography variant="caption" sx={{ ml: 1, color: '#64748b', fontWeight: 600 }}>
                          {message.user.name}
                        </Typography>
                      )}

                      <Paper elevation={0} sx={{
                        p: 2,
                        bgcolor: isOwnMessage ? '#7c3aed' : 'white',
                        color: isOwnMessage ? 'white' : '#1e293b',
                        borderRadius: 3,
                        borderBottomRightRadius: isOwnMessage ? 4 : 24,
                        borderBottomLeftRadius: isOwnMessage ? 24 : 4,
                        boxShadow: isOwnMessage
                          ? '0 4px 15px -3px rgba(124, 58, 237, 0.3)'
                          : '0 2px 10px -2px rgba(0,0,0,0.05)'
                      }}>
                        <Typography variant="body1" sx={{ wordWrap: 'break-word', lineHeight: 1.5 }}>
                          {message.content}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                          <Typography variant="caption" sx={{
                            fontSize: '0.7rem',
                            color: isOwnMessage ? 'rgba(255,255,255,0.7)' : '#94a3b8'
                          }}>
                            {formatDate(message.dateEnvoie)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Fade>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input Area */}
      {isMember && (
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #f1f5f9' }}>
          <Paper
            component="form"
            elevation={0}
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f8fafc',
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              transition: 'border-color 0.2s',
              '&:focus-within': { borderColor: '#7c3aed', bgcolor: 'white' }
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!wsConnected}
              InputProps={{ disableUnderline: true }}
              sx={{ px: 2, py: 1.5 }}
            />
            <IconButton
              type="submit"
              disabled={!newMessage.trim() || !wsConnected}
              sx={{
                mr: 0.5,
                bgcolor: '#7c3aed',
                color: 'white',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#6d28d9', transform: 'scale(1.05)' },
                '&:disabled': { bgcolor: '#e2e8f0', color: '#cbd5e1' },
                transition: 'all 0.2s'
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default GroupeChat;