import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Container, 
  Card, 
  CardContent, 
  CardMedia,
  TextField,
  useTheme,
  useMediaQuery,
  CardActionArea
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Divider from '@mui/material/Divider';
import api from '../services';

// Import images from assets
import dentalQuestionImg from '../assets/d2.jpg';
import findDentistImg from '../assets/d5.jpeg';
import dentalCareKidsImg from '../assets/d6.jpg';

const Welcome = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      // Add user message
      const userMessage = chatInput;
      setChatMessages([...chatMessages, { sender: 'user', text: userMessage }]);
      setChatInput('');
      
      // Add a placeholder bot message for streaming
      setChatMessages(prev => [...prev, { sender: 'bot', text: '', isStreaming: true }]);

      // Use the central chatbot helper to stream a response
      api.chatbot.botAssistant(
        chatMessages,
        userMessage,
        (token, fullText) => {
          // Update the streaming message with the latest text
          setChatMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].isStreaming) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                text: fullText,
              };
            }
            return updated;
          });
        }
      )
        .then((fullResponse) => {
          // Finalise the streaming message
          setChatMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].isStreaming) {
              updated[updated.length - 1] = {
                sender: 'bot',
                text: fullResponse,
                isStreaming: false,
              };
            }
            return updated;
          });
        })
        .catch((error) => {
          console.error('Error calling ChatBot:', error);
          setChatMessages(prev => [
            ...prev,
            { sender: 'bot', text: "I'm sorry, I encountered an error processing your request. Please try again later." },
          ]);
        });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Dental Chat with Live Dentists Section */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            color: isDarkMode ? '#e0f2f1' : 'primary.main',
            mb: 3
          }}
        >
          <Box 
            component="span" 
        sx={{
              textShadow: isDarkMode 
                ? '0 0 10px rgba(0, 230, 180, 0.6), 0 0 20px rgba(0, 230, 180, 0.4)' 
                : '0 0 10px rgba(1, 52, 39, 0.3), 0 0 20px rgba(1, 52, 39, 0.2)',
              letterSpacing: '0.5px',
          position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '3px',
                background: isDarkMode 
                  ? 'linear-gradient(90deg, transparent, #4db6ac, transparent)'
                  : 'linear-gradient(90deg, transparent, #013427, transparent)',
                borderRadius: '2px'
              }
            }}
          >
            Dental Chat
          </Box>
          <Box 
            component="span" 
            sx={{ 
              color: isDarkMode ? '#b2dfdb' : 'inherit',
            }}
          >
            {' with Live Dentists'}
          </Box>
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            align="center"
            sx={{ 
              mx: 2, 
              fontWeight: 'medium',
              color: isDarkMode ? '#81c784' : 'primary.main',
            }}
          >
            Ask Dental Questions
          </Typography>
          <Divider 
            orientation="vertical"
            flexItem
            sx={{ 
              mx: 2, 
              borderColor: isDarkMode ? '#b2dfdb' : 'primary.main',
            }}
          />
          <Typography 
            variant="h6" 
            align="center"
            sx={{ 
              mx: 2, 
              fontWeight: 'medium',
              color: isDarkMode ? '#81c784' : 'primary.main',
            }}
          >
            Find a Clinic
          </Typography>
        </Box>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card 
              elevation={isDarkMode ? 4 : 2}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.9)' : 'background.paper',
                border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={dentalQuestionImg}
                  alt="Dental Questions"
                  sx={{ 
                    borderRadius: 2, 
                    mb: 2,
                    filter: isDarkMode ? 'brightness(0.9)' : 'none' 
                  }}
                />
                <Button
                  component={RouterLink}
                  to="/chat"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 8,
                    px: 3,
                    bgcolor: isDarkMode ? '#00897b' : '#013427',
                    color: isDarkMode ? '#e0f2f1' : 'white',
                    '&:hover': {
                      bgcolor: isDarkMode ? '#00796b' : '#014d40',
                      transform: 'translateY(-3px)',
                      boxShadow: isDarkMode 
                        ? '0 6px 10px rgba(0, 230, 180, 0.3)' 
                        : '0 6px 10px rgba(0, 0, 0, 0.2)'
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode 
                      ? '0 4px 8px rgba(0, 230, 180, 0.2)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: isDarkMode 
                        ? 'linear-gradient(90deg, transparent, rgba(0, 230, 180, 0.2), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      transition: 'all 0.5s ease',
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                >
                  <Box
                    sx={{ 
                      fontWeight: 'medium', 
                      display: 'inline-block',
                      textShadow: isDarkMode 
                        ? '0 1px 3px rgba(0, 0, 0, 0.4)' 
                        : '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>
                    Ask a dental question
                  </Box>
                </Button>
                <Typography 
                  variant="body2" 
                  color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'} 
                  sx={{ mt: 2 }}
                >
                  click here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              elevation={isDarkMode ? 4 : 2}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.9)' : 'background.paper',
                border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={findDentistImg}
                  alt="Find a Clinic"
                  sx={{ 
                    borderRadius: 2, 
                    mb: 2,
                    filter: isDarkMode ? 'brightness(0.9)' : 'none' 
                  }}
                />
                  <Button
                    component={RouterLink}
                    to="/find-a-clinic"
                    variant="contained"
                    color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 8,
                    px: 3,
                    bgcolor: isDarkMode ? '#00897b' : '#013427',
                    color: isDarkMode ? '#e0f2f1' : 'white',
                    '&:hover': {
                      bgcolor: isDarkMode ? '#00796b' : '#014d40',
                      transform: 'translateY(-3px)',
                      boxShadow: isDarkMode 
                        ? '0 6px 10px rgba(0, 230, 180, 0.3)' 
                        : '0 6px 10px rgba(0, 0, 0, 0.2)'
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode 
                      ? '0 4px 8px rgba(0, 230, 180, 0.2)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: isDarkMode 
                        ? 'linear-gradient(90deg, transparent, rgba(0, 230, 180, 0.2), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      transition: 'all 0.5s ease',
                    },
                    '&:hover::before': {
                      left: '100%'
                    }
                  }}
                >
                  <Box sx={{ 
                    fontWeight: 'medium', 
                    display: 'inline-block',
                    textShadow: isDarkMode 
                      ? '0 1px 3px rgba(0, 0, 0, 0.4)' 
                      : '0 1px 2px rgba(0, 0, 0, 0.2)'
                  }}>
                    Find a clinic
                  </Box>
                  </Button>
                <Typography 
                  variant="body2" 
                  color={isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'} 
                  sx={{ mt: 2 }}
                >
                  click here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
            </Grid>
      </Container>

      {/* Dental Health Quiz Section */}
      <Box sx={{ 
        bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.7)' : 'rgba(25, 118, 210, 0.05)', 
        py: 5, 
        my: 4,
        borderTop: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
        borderBottom: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
      }}>
        <Container maxWidth="md">
          <CardActionArea 
            component={RouterLink}
            to="/quiz"
            sx={{
              display: 'block',
              textDecoration: 'none',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: isDarkMode 
                  ? '0 6px 12px rgba(0, 230, 180, 0.2)' 
                  : '0 6px 12px rgba(0, 0, 0, 0.15)'
              },
              transition: 'all 0.25s ease-in-out',
              bgcolor: isDarkMode ? 'rgba(30, 42, 46, 0.9)' : 'background.paper',
              border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
              borderRadius: 2,
              p: 4,
            }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{ 
                color: isDarkMode ? '#4db6ac' : 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                textShadow: isDarkMode ? '0 0 8px rgba(0, 230, 180, 0.3)' : 'none',
                fontWeight: isDarkMode ? 'medium' : 'normal'
              }}
            >
              🦷 Dental Health Quiz
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              align="center" 
              sx={{ 
                mb: 3, 
                fontWeight: 'medium',
                color: isDarkMode ? '#e0f7fa' : 'text.primary'
              }}
            >
              💭 Test your dental knowledge and learn more about oral health!
            </Typography>
            
            <Button 
              fullWidth 
              variant="contained"
              color="primary"
              sx={{ 
                mt: 3,
                textTransform: 'none', 
                py: 1.5,
                bgcolor: isDarkMode ? '#00897b' : '#013427',
                color: isDarkMode ? '#e0f2f1' : 'white',
                '&:hover': {
                  bgcolor: isDarkMode ? '#00796b' : '#014d40',
                }
              }}
            >
              Start Dental Health Quiz
            </Button>
          </CardActionArea>
        </Container>
      </Box>

      {/* Book an Appointment Section */}
      <Container maxWidth="md" sx={{ my: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 4, 
            fontWeight: 'medium',
            color: isDarkMode ? '#e0f2f1' : 'text.primary',
            textShadow: isDarkMode ? '0 0 10px rgba(0, 230, 180, 0.3)' : 'none'
          }}
        >
          Book an Appointment
        </Typography>
        
        <Paper 
          elevation={isDarkMode ? 4 : 1} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.9)' : 'background.paper',
            border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                variant="outlined"
                placeholder="Enter your full name"
                InputLabelProps={{
                  style: {
                    color: isDarkMode ? 'rgba(224, 242, 241, 0.7)' : undefined
                  }
                }}
                sx={{
                  input: {
                    color: isDarkMode ? '#e0f2f1' : 'text.primary'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.3)' : 'rgba(0, 0, 0, 0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.5)' : 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: {
                    color: isDarkMode ? 'rgba(224, 242, 241, 0.7)' : undefined
                  }
                }}
                sx={{
                  input: {
                    color: isDarkMode ? '#e0f2f1' : 'text.primary'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.3)' : 'rgba(0, 0, 0, 0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.5)' : 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: {
                    color: isDarkMode ? 'rgba(224, 242, 241, 0.7)' : undefined
                  }
                }}
                sx={{
                  input: {
                    color: isDarkMode ? '#e0f2f1' : 'text.primary'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.3)' : 'rgba(0, 0, 0, 0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.5)' : 'rgba(0, 0, 0, 0.23)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 1,
                  px: 4,
                  bgcolor: isDarkMode ? '#00897b' : '#013427',
                  color: isDarkMode ? '#e0f2f1' : 'white',
                  fontWeight: 'medium',
                  textShadow: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.4)' : 'none',
                  '&:hover': {
                    bgcolor: isDarkMode ? '#00796b' : '#014d40'
                  }
                }}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Dental Care Image */}
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Container maxWidth="md">
          <CardMedia
            component="img"
            image={dentalCareKidsImg}
            alt="Dental Care for Kids"
            sx={{ 
              borderRadius: 2,
              maxHeight: '300px',
              objectFit: 'cover',
              filter: isDarkMode ? 'brightness(0.85)' : 'none',
              border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
              boxShadow: isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'
            }}
          />
        </Container>
      </Box>

      {/* Learn About Dental Care Section */}
      <Container maxWidth="md" sx={{ my: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 4, 
            fontWeight: 'medium',
            color: isDarkMode ? '#e0f2f1' : 'text.primary',
            textShadow: isDarkMode ? '0 0 10px rgba(0, 230, 180, 0.3)' : 'none'
          }}
        >
          Learn About Dental Care
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              elevation={isDarkMode ? 3 : 1}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: isDarkMode ? 'rgba(38, 62, 51, 0.7)' : 'rgba(255, 243, 224, 0.5)',
                mb: 2,
                border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: isDarkMode ? '#81c784' : 'text.primary',
                  fontWeight: 'medium'
                }}
              >
                How to Brush Properly
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'text.secondary',
                  fontSize: isDarkMode ? '0.9rem' : '0.875rem'
                }}
              >
                Use circular motions, not hard scrubbing.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={isDarkMode ? 3 : 1}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: isDarkMode ? 'rgba(38, 62, 51, 0.7)' : 'rgba(255, 243, 224, 0.5)',
                mb: 2,
                border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: isDarkMode ? '#81c784' : 'text.primary',
                  fontWeight: 'medium'
                }}
              >
                Avoid Sugary Snacks
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'text.secondary',
                  fontSize: isDarkMode ? '0.9rem' : '0.875rem'
                }}
              >
                Sugar increases risk of cavities. Eat fresh fruits instead.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={isDarkMode ? 3 : 1}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                bgcolor: isDarkMode ? 'rgba(38, 62, 51, 0.7)' : 'rgba(255, 243, 224, 0.5)',
                border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.1)' : 'none'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: isDarkMode ? '#81c784' : 'text.primary',
                  fontWeight: 'medium'
                }}
              >
                Benefits of Regular Dental Visits
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.87)' : 'text.secondary',
                  fontSize: isDarkMode ? '0.9rem' : '0.875rem'
                }}
              >
                Detect issues early and maintain overall health.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Chat Button */}
      <Box 
        sx={{ 
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
          <Button
            variant="contained"
            color="primary"
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            minWidth: 'unset',
            bgcolor: chatOpen ? (isDarkMode ? '#00796b' : 'secondary.main') : (isDarkMode ? '#00897b' : 'primary.main'),
            boxShadow: isDarkMode ? '0 2px 12px rgba(0, 230, 180, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onClick={handleChatToggle}
        >
          <ChatBubbleOutlineIcon sx={{ color: isDarkMode ? '#e0f7fa' : 'white' }} />
        </Button>
        
        {/* Chat Panel */}
        {chatOpen && (
          <Paper
            elevation={isDarkMode ? 6 : 3}
            sx={{
              position: 'absolute',
              bottom: 70,
              right: 0,
              width: 300,
              height: 400,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.95)' : 'background.paper',
              border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.15)' : 'none'
            }}
          >
            <Box 
              sx={{ 
                bgcolor: isDarkMode ? '#005f56' : 'primary.main', 
                color: 'white',
                p: 2
              }}
            >
              <Typography 
                variant="subtitle1"
                sx={{ 
                  color: isDarkMode ? '#e0f7fa' : 'white',
                  fontWeight: 'medium'
                }}
              >
                Help Assistant
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                flexGrow: 1, 
                p: 2, 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.95)' : 'background.paper'
              }}
            >
              {chatMessages.map((msg, index) => (
                <Box 
                  key={index}
                  sx={{
                    bgcolor: msg.sender === 'user' 
                      ? (isDarkMode ? 'rgba(0, 137, 123, 0.5)' : 'primary.light') 
                      : (isDarkMode ? 'rgba(55, 71, 79, 0.8)' : 'grey.100'),
                    color: msg.sender === 'user' 
                      ? (isDarkMode ? '#e0f7fa' : 'white') 
                      : (isDarkMode ? '#e0f7fa' : 'text.primary'),
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '80%',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    boxShadow: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'
                  }}
                >
                  <Typography 
                    variant="body2"
                    sx={{
                      color: msg.sender === 'user' 
                        ? (isDarkMode ? '#e0f7fa' : 'white') 
                        : (isDarkMode ? '#e0f7fa' : 'text.primary')
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              ))}
              {chatMessages.length === 0 && (
                <Typography 
                  variant="body2" 
                  color={isDarkMode ? 'rgba(224, 247, 250, 0.7)' : 'text.secondary'}
                  sx={{ textAlign: 'center', mt: 10 }}
                >
                  Hi there! How can I help you today?
                </Typography>
              )}
            </Box>
            
            <Box 
              component="form" 
              onSubmit={handleChatSubmit}
              sx={{ 
                p: 1,
                display: 'flex',
                borderTop: `1px solid ${isDarkMode ? 'rgba(0, 230, 180, 0.2)' : theme.palette.divider}`
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                variant="outlined"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                sx={{ 
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.8)' : 'background.paper',
                    color: isDarkMode ? '#e0f7fa' : 'text.primary',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.3)' : 'rgba(0, 0, 0, 0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(0, 230, 180, 0.5)' : 'rgba(0, 0, 0, 0.23)'
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: isDarkMode ? 'rgba(224, 247, 250, 0.5)' : 'rgba(0, 0, 0, 0.42)'
                  }
                }}
              />
              <Button 
                type="submit" 
                variant="contained"
                color="primary"w
                sx={{
                  bgcolor: isDarkMode ? '#00897b' : 'primary.main',
                  color: isDarkMode ? '#e0f7fa' : 'white',
                  '&:hover': {
                    bgcolor: isDarkMode ? '#00796b' : 'primary.dark'
                  }
                }}
              >
                Send
          </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Welcome;
