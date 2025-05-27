import { Box } from '@mui/material';
import React from 'react';
import Header from './Header';
import FloatingChatHelper from './Helper';

const Home = ({ children,isMobile, darkMode, toggleDarkMode }) => {

  return (
    <Box sx={{ display: 'flex', pt: 10, flexDirection: 'column', minHeight: 'calc(100vh - 100px)' }}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} isMobile={isMobile} />
      {children}
      <FloatingChatHelper darkMode={darkMode} toggleDarkMode={toggleDarkMode} isMobile={isMobile} />
    </Box>
  );
};

export default Home;