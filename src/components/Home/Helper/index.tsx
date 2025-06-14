import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import api from '../../../services';


interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isStreaming?: boolean;
}

interface FloatingChatHelperProps {
  darkMode?: boolean;
  toggleDarkMode?: () => void;
  isMobile?: boolean;
}

const FloatingChatHelper: React.FC<FloatingChatHelperProps> = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (chatInput.trim()) {
      const userMessage = chatInput;
      setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
      setChatInput('');

      setChatMessages(prev => [...prev, { sender: 'bot', text: '', isStreaming: true }]);

      api.chatbot.help(
          userMessage,
          (token: string, fullText: string) => {
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
          .then((fullResponse: string) => {
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
          .catch((error: any) => {
            console.error('Error calling ChatBot:', error);
            setChatMessages(prev => {
              // Remove the streaming placeholder on error
              const filtered = prev.filter(msg => !msg.isStreaming);
              return [
                ...filtered,
                {
                  sender: 'bot',
                  text: "I'm sorry, I encountered an error processing your request. Please try again later."
                },
              ];
            });
          });
    }
  };

  return (
      <Box sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 20 },
        right: { xs: 16, sm: 20 },
        zIndex: 1000
      }}>
        <Tooltip title="Chat with AI Assistant" arrow placement="left">
          <Fab
              color="primary"
              aria-label="chat"
              onClick={handleChatToggle}
              size={isSmallMobile ? "medium" : "large"}
              sx={{
                bgcolor: chatOpen ? (isDarkMode ? '#00796b' : 'secondary.main') : (isDarkMode ? '#00897b' : 'primary.main'),
                boxShadow: isDarkMode ? '0 2px 12px rgba(0, 230, 180, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 }
              }}
          >
            <HelpIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}/>
          </Fab>
        </Tooltip>

        {chatOpen && (
            <Paper
                elevation={isDarkMode ? 6 : 3}
                sx={{
                  position: 'absolute',
                  bottom: { xs: 60, sm: 70 },
                  right: 0,
                  width: { xs: 280, sm: 300, md: 320 },
                  height: { xs: 350, sm: 400 },
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  bgcolor: isDarkMode ? 'rgba(38, 50, 56, 0.95)' : 'background.paper',
                  border: isDarkMode ? '1px solid rgba(0, 230, 180, 0.15)' : 'none',
                  borderRadius: 2
                }}
            >
              <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2
                  }}
              >
                <Typography variant="subtitle1" sx={{fontWeight: 'medium'}}>
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
                    bgcolor: 'background.paper',
                  }}
              >
                {chatMessages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          maxWidth: '80%',
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          bgcolor: msg.sender === 'user'
                              ? theme.palette.primary.light
                              : (isDarkMode ? theme.palette.grey[700] : theme.palette.grey[200]),
                          color: msg.sender === 'user'
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                          boxShadow: isDarkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
                        }}
                    >
                      <Typography variant="body2" sx={{color: 'inherit'}}>
                        {msg.text}
                      </Typography>
                    </Box>
                ))}
                {chatMessages.length === 0 && (
                    <Typography
                        variant="body2"
                        sx={{
                          textAlign: 'center',
                          mt: 10,
                          color: 'text.secondary',
                        }}
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
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
              >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your message..."
                    variant="outlined"
                    value={chatInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChatInput(e.target.value)}
                    sx={{mr: 1}}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                  Send
                </Button>
              </Box>
            </Paper>
        )}
      </Box>
  );
};

export default FloatingChatHelper;
export type { ChatMessage };
