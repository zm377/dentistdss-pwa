import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, Typography, useMediaQuery } from '@mui/material';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import config from './config';
import './App.css';

import AppRoutes from './components/AppRoutes';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { loading } = useAuth();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [initialThemeSet, setInitialThemeSet] = useState(false);

  React.useEffect(() => {
    if (!initialThemeSet) {
      setDarkMode(prefersDarkMode);
      setInitialThemeSet(true);
    }
  }, [prefersDarkMode, initialThemeSet]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#013427',
        },
        secondary: {
          main: '#014d40',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#312635' : '#ffffff',
        },
        marginTop: {
          xs: '64px',
          sm: '72px',
          md: '80px',
        }
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    }), [darkMode]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Container
            maxWidth="md"
            sx={theme => ({
              flexGrow: 1,
              paddingTop: {
                xs: `calc(56px + ${theme.spacing(1)} + ${theme.spacing(2)})`,
                sm: `calc(64px + ${theme.spacing(2)} + ${theme.spacing(3)})`,
                md: `calc(64px + ${theme.spacing(2)} + ${theme.spacing(4)})`
              },
              paddingBottom: {
                xs: theme.spacing(2),
                sm: theme.spacing(3),
                md: theme.spacing(4)
              },
              px: { xs: 1, sm: 2, md: 3 }
            })}
          >
            <AppRoutes />
          </Container>
          <Box
            component="footer"
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(38, 50, 56, 0.9)' : 'background.paper',
              textAlign: 'center',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
              borderBottomWidth: 0
            }}
          >
            <Typography
              variant="body2"
              sx={{ 
                fontSize: 'inherit',
                color: theme => theme.palette.mode === 'dark' ? '#e0f2f1' : 'text.secondary',
                '& a': {
                  color: theme => theme.palette.mode === 'dark' ? '#81c784' : 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              © {new Date().getFullYear()} {config.app.name} by Zhifei Mi - All rights reserved.
              Contact us at: <a href="mailto:dentistdss@gmail.com">dentistdss@gmail.com</a>
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
