import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Header = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  
  return (
    <AppBar 
      position="static" 
      elevation={darkMode ? 2 : 0}
      sx={{
        background: darkMode 
          ? 'linear-gradient(to right, #1a237e, #283593)' 
          : theme.palette.primary.main,
        transition: 'background 0.5s ease'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospitalIcon 
            sx={{ 
              mr: 1,
              color: darkMode ? '#64ffda' : 'inherit',
              filter: darkMode ? 'drop-shadow(0 0 2px rgba(100, 255, 218, 0.5))' : 'none'
            }} 
          />
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 'bold',
              color: darkMode ? '#e0f7fa' : 'inherit',
              textShadow: darkMode ? '0px 0px 8px rgba(224, 247, 250, 0.3)' : 'none'
            }}
          >
            DentistGPT
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton 
          color="inherit" 
          onClick={toggleDarkMode}
          sx={{
            bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            '&:hover': {
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)'
            }
          }}
        >
          {darkMode ? 
            <Brightness7Icon sx={{ color: '#ffeb3b' }} /> : 
            <Brightness4Icon />
          }
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;