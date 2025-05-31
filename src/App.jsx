import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { useAuth } from './context/AuthContext';
import './styles/App.css';
import GlobalSnackbar from './components/GlobalSnackbar';
import AppShell from './components/AppShell';
import { NotificationProvider } from './components/NotificationSystem';
import theme from './theme';

import AppRoutes from './routes';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { loading, logout } = useAuth();
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

  const appTheme = useMemo(() => theme(darkMode ? 'dark' : 'light'), [darkMode]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <AppShell
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            logout={logout}
          >
            <AppRoutes />
          </AppShell>
        </Router>
        <GlobalSnackbar />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
