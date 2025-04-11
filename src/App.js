import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, Typography } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import config from './config';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create the theme once when darkMode changes using useMemo
  const theme = useMemo(() => 
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#42a5f5',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#1e1e1e' : '#ffffff',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            {config.app.name} - Your Dental Assistant
          </Typography>
          <ChatInterface apiKeyProp={config.chatbot.apiKey} />
        </Container>
        <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {config.app.name} - For Academic Research purposes only. Not a substitute for professional dental advice.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
