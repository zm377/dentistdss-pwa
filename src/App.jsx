import { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { useAuth } from './context/auth';
import useDarkMode from './hooks/useDarkMode';
import './styles/App.css';
import GlobalSnackbar from './components/GlobalSnackbar';
import AppShell from './components/AppShell';
import { NotificationProvider } from './components/NotificationSystem';
import { AppProvider } from '@toolpad/core/AppProvider';
import theme from './context/theme';

import AppRoutes from './routes';

function App() {
  const { loading, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const appTheme = useMemo(() => theme(darkMode ? 'dark' : 'light'), [darkMode]);

  if (loading) {
    return null;
  }

  return (
    <AppProvider
      theme={appTheme}
    >
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
          <GlobalSnackbar />
        </Router>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
