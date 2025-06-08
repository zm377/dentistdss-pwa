import { Box } from '@mui/material';
import React from 'react';
import Header from '../../components/Home/Header';
import FloatingChatHelper from '../../components/Home/Helper';
import Footer from '../../components/Footer';

interface HomeProps {
  children?: React.ReactNode;
  isMobile: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

/**
 * Home - Main layout component for the home page
 * 
 * Features:
 * - Header with navigation and dark mode toggle
 * - Main content area for child components
 * - Floating chat helper
 * - Footer
 * - Responsive design support
 */
const Home: React.FC<HomeProps> = ({ children, isMobile, darkMode, toggleDarkMode }) => {
  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        pt: 10, 
        flexDirection: 'column', 
        minHeight: 'calc(100vh - 50px)' 
      }}>
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          isMobile={isMobile} 
        />
        {children}
        <FloatingChatHelper 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          isMobile={isMobile} 
        />
      </Box>
      <Footer />
    </>
  );
};

export default Home;
