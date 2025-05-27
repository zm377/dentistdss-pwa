import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  useTheme,
  Fab,
  Tooltip
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import api from '../../../services'; // Adjusted import path

const FloatingChatHelper = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      const userMessage = chatInput;
      setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
      setChatInput('');

      setChatMessages(prev => [...prev, { sender: 'bot', text: '', isStreaming: true }]);

      api.chatbot.botAssistant(
        chatMessages.filter(msg => !msg.isStreaming), // Send previous messages without the current streaming one
        userMessage,
        (token, fullText) => {
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
          setChatMessages(prev => {
            // Remove the streaming placeholder on error
            const filtered = prev.filter(msg => !msg.isStreaming);
            return [
              ...filtered,
              { sender: 'bot', text: "I'm sorry, I encountered an error processing your request. Please try again later." },
            ];
          });
        });
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Tooltip title="Chat with AI Assistant" arrow placement="left">
        <Fab
          color="primary"
          aria-label="chat"
          onClick={handleChatToggle}
          sx={{
            bgcolor: chatOpen ? (isDarkMode ? '#00796b' : 'secondary.main') : (isDarkMode ? '#00897b' : 'primary.main'),
            boxShadow: isDarkMode ? '0 2px 12px rgba(0, 230, 180, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <HelpIcon />
        </Fab>
      </Tooltip>

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
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 2
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
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
                <Typography variant="body2" sx={{ color: 'inherit' }}>
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
              onChange={(e) => setChatInput(e.target.value)}
              sx={{ mr: 1 }}
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
