import { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  AppBar,
  Toolbar,
  CircularProgress,
  Button,
  Fade,
  Zoom,
  Tooltip,
  Badge,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  MoreVert as MoreVertIcon,
  EmojiEmotions as EmojiIcon,
  AttachFile as AttachIcon,
  DoneAll as DoneAllIcon,
  ChatBubbleOutline as ChatIcon
} from '@mui/icons-material';
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
  const inputRef = useRef(null);

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
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      }

      if (date.toDateString() === yesterday.toDateString()) {
        return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      }

      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (eror) {
      return 'Date invalide';
    }
  };

  const getDateDivider = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const shouldShowDateDivider = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.dateEnvoie).toDateString();
    const prevDate = new Date(prevMsg.dateEnvoie).toDateString();
    return currentDate !== prevDate;
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)',
        background: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)'
      }}>
        <Box sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress
            sx={{ color: '#8b5cf6' }}
            size={70}
            thickness={3}
          />
          <Avatar sx={{
            position: 'absolute',
            bgcolor: '#7c3aed',
            width: 40,
            height: 40
          }}>
            <ChatIcon />
          </Avatar>
        </Box>
        <Typography
          variant="body1"
          sx={{ mt: 3, color: '#6d28d9', fontWeight: 500 }}
        >
          Chargement des messages...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: '#faf5ff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237c3aed' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header Premium */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%)',
          color: 'white',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: '0 8px 32px -8px rgba(109, 40, 217, 0.5)',
          zIndex: 10,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            pointerEvents: 'none'
          }
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important', px: 2 }}>
          <Tooltip title="Retour" arrow>
            <IconButton
              edge="start"
              onClick={onBack}
              sx={{
                mr: 2,
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                bgcolor: isMember && wsConnected ? '#4ade80' : '#fb7185',
                border: '2px solid white',
                boxShadow: isMember && wsConnected ? '0 0 12px #4ade80' : 'none',
                animation: isMember && wsConnected ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.4)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(74, 222, 128, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(74, 222, 128, 0)' }
                }
              }} />
            }
          >
            <Avatar
              sx={{
                bgcolor: 'white',
                color: '#7c3aed',
                mr: 2,
                width: 50,
                height: 50,
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                border: '3px solid rgba(255,255,255,0.3)'
              }}
            >
              {groupeNom.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {groupeNom}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.9,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5
              }}
            >
              {isMember ? (
                wsConnected ? (
                  <>
                    <Box component="span" sx={{ color: '#4ade80' }}>●</Box>
                    En ligne • {messages.length} messages
                  </>
                ) : 'Reconnexion...'
              ) : 'Aperçu du groupe'}
            </Typography>
          </Box>

          <Tooltip title="Options" arrow>
            <IconButton
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box sx={{
        flexGrow: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c4b5fd',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a78bfa',
        }
      }}>
        {!isMember ? (
          <Fade in={true} timeout={800}>
            <Paper
              elevation={0}
              sx={{
                p: 5,
                maxWidth: 420,
                mx: 'auto',
                mt: 6,
                textAlign: 'center',
                borderRadius: 5,
                bgcolor: 'white',
                boxShadow: '0 20px 60px -20px rgba(109, 40, 217, 0.2)',
                border: '1px solid #ede9fe',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #6d28d9, #8b5cf6, #a78bfa)'
                }
              }}
            >
              <Box sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: '#f5f3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: 'inset 0 2px 10px rgba(124, 58, 237, 0.1)'
              }}>
                <Avatar sx={{
                  width: 70,
                  height: 70,
                  bgcolor: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                  background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
                }}>
                  <GroupIcon sx={{ fontSize: 35, color: 'white' }} />
                </Avatar>
              </Box>

              <Typography
                variant="h5"
                fontWeight="800"
                sx={{
                  color: '#1e1b4b',
                  mb: 1
                }}
              >
                Rejoindre {groupeNom}
              </Typography>

              <Typography
                color="#64748b"
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Rejoignez la discussion pour échanger avec votre classe et vos professeurs en temps réel.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={joining ? null : <PersonAddIcon />}
                onClick={handleJoinGroupe}
                disabled={joining}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 24px -8px rgba(124, 58, 237, 0.5)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
                    boxShadow: '0 12px 28px -8px rgba(124, 58, 237, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: '#e2e8f0'
                  },
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                {joining ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Rejoindre le groupe'
                )}
              </Button>
            </Paper>
          </Fade>
        ) : messages.length === 0 ? (
          <Fade in={true} timeout={600}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <Box sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                bgcolor: '#f5f3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <ChatIcon sx={{ fontSize: 50, color: '#c4b5fd' }} />
              </Box>
              <Typography variant="h6" fontWeight="600" color="#6d28d9" gutterBottom>
                Aucun message pour l'instant
              </Typography>
              <Typography variant="body2" color="#94a3b8" sx={{ maxWidth: 280 }}>
                Soyez le premier à lancer la discussion dans ce groupe !
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pb: 2 }}>
            {messages.map((message, index) => {
              const isOwnMessage = message.user.email === currentUser?.email;
              const showAvatar = index === 0 || messages[index - 1].user.email !== message.user.email;
              const showDateDivider = shouldShowDateDivider(message, messages[index - 1]);

              return (
                <Box key={message.id || index}>
                  {/* Date Divider */}
                  {showDateDivider && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      my: 3
                    }}>
                      <Divider sx={{ flexGrow: 1, borderColor: '#e9d5ff' }} />
                      <Typography
                        variant="caption"
                        sx={{
                          px: 2,
                          py: 0.5,
                          bgcolor: '#f5f3ff',
                          borderRadius: 2,
                          color: '#7c3aed',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize'
                        }}
                      >
                        {getDateDivider(message.dateEnvoie)}
                      </Typography>
                      <Divider sx={{ flexGrow: 1, borderColor: '#e9d5ff' }} />
                    </Box>
                  )}

                  {/* Message */}
                  <Zoom in={true} style={{ transitionDelay: `${index * 30}ms` }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: isOwnMessage ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 1,
                      mb: showAvatar ? 1.5 : 0.5
                    }}>
                      {showAvatar ? (
                        <Tooltip title={message.user.name} placement={isOwnMessage ? 'left' : 'right'}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: isOwnMessage
                                ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
                                : '#e2e8f0',
                              background: isOwnMessage
                                ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
                                : '#e2e8f0',
                              color: isOwnMessage ? 'white' : '#64748b',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              boxShadow: isOwnMessage
                                ? '0 4px 12px -4px rgba(124, 58, 237, 0.4)'
                                : 'none'
                            }}
                          >
                            {message.user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </Tooltip>
                      ) : (
                        <Box sx={{ width: 36 }} />
                      )}

                      <Box sx={{ maxWidth: '75%' }}>
                        {showAvatar && !isOwnMessage && (
                          <Typography
                            variant="caption"
                            sx={{
                              ml: 1.5,
                              color: '#7c3aed',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            {message.user.name}
                          </Typography>
                        )}

                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            px: 2.5,
                            bgcolor: isOwnMessage
                              ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
                              : 'white',
                            background: isOwnMessage
                              ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
                              : 'white',
                            color: isOwnMessage ? 'white' : '#1e293b',
                            borderRadius: 3,
                            borderTopRightRadius: isOwnMessage && showAvatar ? 4 : 20,
                            borderTopLeftRadius: !isOwnMessage && showAvatar ? 4 : 20,
                            borderBottomRightRadius: isOwnMessage ? 4 : 20,
                            borderBottomLeftRadius: isOwnMessage ? 20 : 4,
                            boxShadow: isOwnMessage
                              ? '0 6px 20px -6px rgba(124, 58, 237, 0.4)'
                              : '0 2px 12px -4px rgba(0,0,0,0.08)',
                            border: isOwnMessage ? 'none' : '1px solid #f1f5f9',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              wordWrap: 'break-word',
                              lineHeight: 1.6,
                              fontSize: '0.95rem'
                            }}
                          >
                            {message.content}
                          </Typography>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                            mt: 1
                          }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.7rem',
                                color: isOwnMessage ? 'rgba(255,255,255,0.75)' : '#94a3b8'
                              }}
                            >
                              {formatDate(message.dateEnvoie)}
                            </Typography>
                            {isOwnMessage && (
                              <DoneAllIcon sx={{
                                fontSize: 14,
                                color: 'rgba(255,255,255,0.75)'
                              }} />
                            )}
                          </Box>
                        </Paper>
                      </Box>
                    </Box>
                  </Zoom>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Box>

      {/* Input Area */}
      {isMember && (
        <Fade in={true}>
          <Box sx={{
            p: 2,
            bgcolor: 'white',
            borderTop: '1px solid #ede9fe',
            boxShadow: '0 -4px 20px -4px rgba(109, 40, 217, 0.08)',
            zIndex: 10
          }}>
            <Paper
              component="form"
              elevation={0}
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#faf5ff',
                borderRadius: 4,
                border: '2px solid #ede9fe',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  borderColor: '#a78bfa',
                  bgcolor: 'white',
                  boxShadow: '0 4px 20px -4px rgba(124, 58, 237, 0.15)'
                }
              }}
            >
              <Tooltip title="Emoji" arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: '#a78bfa',
                    '&:hover': { bgcolor: '#f5f3ff' }
                  }}
                >
                  <EmojiIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Joindre un fichier" arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: '#a78bfa',
                    '&:hover': { bgcolor: '#f5f3ff' }
                  }}
                >
                  <AttachIcon />
                </IconButton>
              </Tooltip>

              <TextField
                fullWidth
                variant="standard"
                placeholder="Écrivez votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!wsConnected}
                inputRef={inputRef}
                multiline
                maxRows={4}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '0.95rem',
                    '& textarea': {
                      '&::placeholder': {
                        color: '#a78bfa',
                        opacity: 0.8
                      }
                    }
                  }
                }}
                sx={{ px: 1 }}
              />

              <Tooltip title={wsConnected ? "Envoyer" : "Connexion en cours..."} arrow>
                <span>
                  <IconButton
                    type="submit"
                    disabled={!newMessage.trim() || !wsConnected}
                    sx={{
                      background: newMessage.trim() && wsConnected
                        ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
                        : '#e2e8f0',
                      color: newMessage.trim() && wsConnected ? 'white' : '#cbd5e1',
                      width: 44,
                      height: 44,
                      boxShadow: newMessage.trim() && wsConnected
                        ? '0 4px 14px -4px rgba(124, 58, 237, 0.5)'
                        : 'none',
                      '&:hover': {
                        background: newMessage.trim() && wsConnected
                          ? 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)'
                          : '#e2e8f0',
                        transform: newMessage.trim() && wsConnected ? 'scale(1.08)' : 'none'
                      },
                      '&:disabled': {
                        bgcolor: '#e2e8f0',
                        color: '#cbd5e1'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Paper>

            {!wsConnected && (
              <Typography
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 1,
                  color: '#f59e0b'
                }}
              >
                <CircularProgress size={12} sx={{ color: '#f59e0b' }} />
                Reconnexion au serveur...
              </Typography>
            )}
          </Box>
        </Fade>
      )}
    </Box>
  );
}

export default GroupeChat;