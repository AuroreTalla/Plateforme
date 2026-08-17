import { useState, useEffect, useRef, useContext} from 'react';
import { Box, Paper, Typography,
  TextField, IconButton, Avatar, AppBar,
  Toolbar,
  CircularProgress,
  Fade
} from '@mui/material';

import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

import { AuthContext } from "../../Composants/Authentification/AuthContext";

import { getMessages } from '../../ConfigBackEnd/GroupService';

import {
  subscribeToGroupe,
  sendMessage,
  isConnected
} from '../../ConfigBackEnd/WebSocketConfig';
import { formatDate } from '../../ConfigBackEnd/FormatDate';



function GroupeChat({
  groupeId,
  groupeNom,
  onBack,
  wsConnected
}) {

  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);


  // ============================================================
  // Scroll automatique
  // ============================================================

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  };

  useEffect(() => {

    scrollToBottom();

  }, [messages]);


  // Chargement des messages
  useEffect(() => {

    const loadMessages = async () => {
      try {

        setLoading(true);

        console.log(
          "📨 Chargement messages du groupe :",
          groupeId
        );

        const res = await getMessages(groupeId);

        console.log(
          "📨 Messages reçus :",
          res.data
        );

        setMessages(res.data);

      } catch (error) {

        console.error(
          "❌ Erreur récupération messages :",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    if (groupeId !== null && groupeId !== undefined) {

      loadMessages();

    }

  }, [groupeId]);


  // ============================================================
  // Souscription WebSocket
  // ============================================================

  useEffect(() => {

    if (
      groupeId === null ||
      groupeId === undefined ||
      !wsConnected
    ) {
      return;
    }

    console.log(
      "📡 Abonnement au groupe :",
      groupeId
    );


    // Supprimer l'ancien abonnement
    if (subscriptionRef.current) {

      subscriptionRef.current.unsubscribe();

      subscriptionRef.current = null;

    }


    // Nouvel abonnement
    subscriptionRef.current = subscribeToGroupe(
      groupeId,
      (message) => {

        console.log(
          "📨 Nouveau message reçu :",
          message
        );

        setMessages((prev) => [
          ...prev,
          message
        ]);

      }
    );


    // Nettoyage
    return () => {

      if (subscriptionRef.current) {

        subscriptionRef.current.unsubscribe();

        subscriptionRef.current = null;

      }

    };

  }, [groupeId, wsConnected]);


  // Envoi du message
  // 

  const handleSendMessage = () => {

    if (!newMessage.trim()) {
     return;
    }

    if (!currentUser?.email) {
      console.error(
        "❌ Utilisateur non disponible"
      );
      return;
    }

    if (!isConnected()) {
      console.error(
        "❌ WebSocket réellement déconnecté"
      );
      return;
    }

    console.log(
      "📤 Envoi message :",
      {
        groupeId,
        groupeNom,
        content: newMessage,
        userEmail: currentUser.email
      }
    );

    const success = sendMessage(
      groupeId,
      newMessage,
      currentUser.email
    );


    if (success) {
      setNewMessage('');
    }

  };

  // ============================================================
  // Chargement
  // ============================================================

  if (loading) {

    return (

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minHeight: '500px',
          bgcolor: '#f3f4f6'
        }}
      >

        <CircularProgress
          sx={{ color: '#8b5cf6' }}
          size={60}
        />

      </Box>

    );

  }


  // ============================================================
  // Interface Chat
  // ============================================================

  return (

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        bgcolor: '#f8fafc',
        overflow: 'hidden'
      }}
    >

      {/* HEADER */}

      <AppBar
        position="static"
        elevation={0}
        sx={{
          background:
            'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
          color: 'white',
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          boxShadow:
            '0 4px 20px -5px rgba(109, 40, 217, 0.4)'
        }}
      >

        <Toolbar
          sx={{
            minHeight: '70px !important'
          }}
        >

          <IconButton
            edge="start"
            onClick={onBack}
            sx={{
              mr: 2,
              color: 'white',
              '&:hover': {
                bgcolor:
                  'rgba(255,255,255,0.1)'
              }
            }}
          >

            <ArrowBackIcon />

          </IconButton>


          {/* Avatar basé sur le NOM */}
          <Avatar
            sx={{
              bgcolor: 'white',
              color: '#7c3aed',
              mr: 2,
              boxShadow:
                '0 2px 10px rgba(0,0,0,0.1)',
              fontWeight: 'bold'
            }}
          >

            {groupeNom
              ? groupeNom
                  .charAt(0)
                  .toUpperCase()
              : 'G'}

          </Avatar>


          <Box sx={{ flexGrow: 1 }}>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ lineHeight: 1.2 }}
            >
              {groupeNom}
            </Typography>


            <Typography
              variant="caption"
              sx={{
                opacity: 0.8
              }}
            >
              Groupe #{groupeId}
            </Typography>

          </Box>


          <IconButton
            size="small"
            sx={{
              color: 'white',
              opacity: 0.8
            }}
          >

            <MoreVertIcon />

          </IconButton>

        </Toolbar>

      </AppBar>


      {/* =====================================================
          ZONE DES MESSAGES
      ====================================================== */}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >

        {messages.length === 0 ? (

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              opacity: 0.5
            }}
          >

            <GroupIcon
              sx={{
                fontSize: 64,
                mb: 2,
                color: '#cbd5e1'
              }}
            />

            <Typography
              variant="h6"
              color="#94a3b8"
            >
              Aucun message
            </Typography>

            <Typography
              variant="body2"
              color="#94a3b8"
            >
              Lancez la discussion !
            </Typography>

          </Box>

        ) : (

          messages.map((message, index) => {

            const isOwnMessage =
              message.user?.email ===
              currentUser?.email;


            const showAvatar =
              index === 0 ||
              messages[index - 1]?.user?.email !==
              message.user?.email;


            return (

              <Fade
                in={true}
                key={
                  message.id ||
                  `${index}-${message.content}`
                }
              >

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection:
                      isOwnMessage
                        ? 'row-reverse'
                        : 'row',
                    alignItems: 'flex-end',
                    gap: 1.5,
                    mb: 1
                  }}
                >

                  {/* Avatar */}

                  {showAvatar ? (

                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor:
                          isOwnMessage
                            ? '#7c3aed'
                            : '#e2e8f0',
                        color:
                          isOwnMessage
                            ? 'white'
                            : '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >

                      {message.user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || 'U'}

                    </Avatar>

                  ) : (

                    <Box
                      sx={{
                        width: 32
                      }}
                    />

                  )}


                  {/* Message */}

                  <Box
                    sx={{
                      maxWidth: '70%'
                    }}
                  >

                    {showAvatar &&
                      !isOwnMessage && (

                        <Typography
                          variant="caption"
                          sx={{
                            ml: 1,
                            color: '#64748b',
                            fontWeight: 600
                          }}
                        >

                          {message.user?.name ||
                            'Utilisateur'}

                        </Typography>

                      )}


                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor:
                          isOwnMessage
                            ? '#7c3aed'
                            : 'white',
                        color:
                          isOwnMessage
                            ? 'white'
                            : '#1e293b',
                        borderRadius: 3,
                        borderBottomRightRadius:
                          isOwnMessage
                            ? 4
                            : 24,
                        borderBottomLeftRadius:
                          isOwnMessage
                            ? 24
                            : 4,
                        boxShadow:
                          isOwnMessage
                            ? '0 4px 15px -3px rgba(124, 58, 237, 0.3)'
                            : '0 2px 10px -2px rgba(0,0,0,0.05)'
                      }}
                    >

                      <Typography
                        variant="body1"
                        sx={{
                          wordWrap:
                            'break-word',
                          lineHeight: 1.5
                        }}
                      >

                        {message.content}

                      </Typography>


                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 0.5
                        }}
                      >

                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.7rem',
                            color:
                              isOwnMessage
                                ? 'rgba(255,255,255,0.7)'
                                : '#94a3b8'
                          }}
                        >
                          {formatDate(message.dateEnvoie)}
                        </Typography>

                      </Box>

                    </Paper>

                  </Box>

                </Box>

              </Fade>

            );

          })

        )}


        <div ref={messagesEndRef} />

      </Box>


      {/* =====================================================
          ZONE DE SAISIE
      ====================================================== */}

      <Box
        sx={{
          p: 2,
          bgcolor: 'white',
          borderTop:
            '1px solid #f1f5f9'
        }}
      >

        <Paper
          component="form"
          elevation={0}
          onSubmit={(e) => {

            e.preventDefault();

            handleSendMessage();

          }}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#f8fafc',
            borderRadius: 4,
            border:
              '1px solid #e2e8f0',
            transition:
              'border-color 0.2s',

            '&:focus-within': {
              borderColor: '#7c3aed',
              bgcolor: 'white'
            }
          }}
        >

          <TextField
            fullWidth
            variant="standard"
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) =>
              setNewMessage(e.target.value)
            }
            disabled={!wsConnected}
            InputProps={{
              disableUnderline: true
            }}
            sx={{
              px: 2,
              py: 1.5
            }}
          />


          <IconButton
            type="submit"
            disabled={
              !newMessage.trim() ||
              !wsConnected
            }
            sx={{
              mr: 0.5,
              bgcolor: '#7c3aed',
              color: 'white',
              width: 40,
              height: 40,

              '&:hover': {
                bgcolor: '#6d28d9',
                transform: 'scale(1.05)'
              },

              '&:disabled': {
                bgcolor: '#e2e8f0',
                color: '#cbd5e1'
              },

              transition: 'all 0.2s'
            }}
          >

            <SendIcon fontSize="small" />

          </IconButton>

        </Paper>

      </Box>

    </Box>

  );

}

export default GroupeChat;