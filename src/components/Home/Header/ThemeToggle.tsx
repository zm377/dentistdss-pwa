import React from 'react';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

/**
 * Theme toggle button component
 * Simplified theme toggle logic
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  darkMode, 
  toggleDarkMode 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <IconButton
      color="inherit"
      onClick={toggleDarkMode}
      size={isMobile ? "small" : "medium"}
      sx={{
        mr: isMobile ? 1 : 2,
        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        '&:hover': {
          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {darkMode ? (
        <Brightness7Icon 
          sx={{ 
            color: '#ffeb3b', 
            fontSize: isMobile ? '1.2rem' : '1.5rem' 
          }} 
        />
      ) : (
        <Brightness4Icon 
          sx={{ 
            fontSize: isMobile ? '1.2rem' : '1.5rem' 
          }} 
        />
      )}
    </IconButton>
  );
};
