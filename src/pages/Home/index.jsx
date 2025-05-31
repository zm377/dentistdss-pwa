import {Box} from '@mui/material';
import React from 'react';
import Header from '../../components/Home/Header';
import FloatingChatHelper from '../../components/Home/Helper';
import Footer from '../../components/Footer';

const Home = ({children, isMobile, darkMode, toggleDarkMode}) => {

  return (
      <>
        <Box sx={{display: 'flex', pt: 10, flexDirection: 'column', minHeight: 'calc(100vh - 50px)'}}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} isMobile={isMobile}/>
          {children}
          <FloatingChatHelper darkMode={darkMode} toggleDarkMode={toggleDarkMode} isMobile={isMobile}/>
        </Box>
        <Footer/>
      </>
  );
};

export default Home;