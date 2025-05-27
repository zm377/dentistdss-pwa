import React from 'react';
import {
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import dictionary from '../../utils/dictionary';

import Footer from '../Footer';
import Home from '../../pages/Home';
import Dashboard from '../../pages/Dashboard';

const AppShell = ({
  children,
  darkMode,
  toggleDarkMode,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Show help FAB only on public pages
  const isPublicPage = dictionary.locations.public.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)' }}>
      {(isPublicPage) ? (
        <Home isMobile={isMobile} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
          {children}
        </Home>
      ) : (
        <Dashboard isMobile={isMobile} darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
          {children}
        </Dashboard>
      )}
      <Footer />
    </Box>
  );
};

export default AppShell;
