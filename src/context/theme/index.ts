import { createTheme, Theme } from '@mui/material/styles';
import { ThemeMode } from '../../types';

// Enhanced dental clinic theme
const theme = (mode: ThemeMode): Theme => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#013427' : '#4caf50', // Deep green for dental/medical
      light: mode === 'light' ? '#4caf50' : '#81c784',
      dark: mode === 'light' ? '#00251a' : '#2e7d32',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#014d40' : '#26a69a', // Teal accent
      light: mode === 'light' ? '#26a69a' : '#4db6ac',
      dark: mode === 'light' ? '#00332b' : '#00695c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: mode === 'light' ? '#f8fffe' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#172b4d' : '#ffffff',
      secondary: mode === 'light' ? '#6b778c' : '#b0bec5',
    },
    divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.25vw, 1rem)',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: 'clamp(0.875rem, 1.25vw, 1rem)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          elevation: 0,
          boxShadow: mode === 'light'
            ? '0px 1px 3px rgba(0, 0, 0, 0.12)'
            : '0px 1px 3px rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          minHeight: 44, // Minimum touch target size
          padding: '12px 20px',
          '@media (max-width: 600px)': {
            minHeight: 48, // Larger touch target on mobile
            padding: '14px 24px',
            fontSize: '1rem',
          },
        },
        contained: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
        sizeSmall: {
          minHeight: 36,
          padding: '8px 16px',
          '@media (max-width: 600px)': {
            minHeight: 40,
            padding: '10px 18px',
          },
        },
        sizeLarge: {
          minHeight: 52,
          padding: '16px 28px',
          '@media (max-width: 600px)': {
            minHeight: 56,
            padding: '18px 32px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light'
            ? '0px 2px 8px rgba(0, 0, 0, 0.08)'
            : '0px 2px 8px rgba(0, 0, 0, 0.3)',
          border: mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.05)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.12)'
            : '1px solid rgba(255, 255, 255, 0.12)',
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            minHeight: 44, // Minimum touch target
            '@media (max-width: 600px)': {
              minHeight: 48, // Larger on mobile
              fontSize: '16px', // Prevents zoom on iOS
            },
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px',
            '@media (max-width: 600px)': {
              padding: '14px 16px',
              fontSize: '16px', // Prevents zoom on iOS
            },
          },
          '& .MuiInputLabel-root': {
            '@media (max-width: 600px)': {
              fontSize: '16px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0px 1px 3px rgba(0, 0, 0, 0.08)'
            : '0px 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 0',
          '&.Mui-selected': {
            backgroundColor: mode === 'light'
              ? 'rgba(1, 52, 39, 0.08)'
              : 'rgba(76, 175, 80, 0.16)',
            '&:hover': {
              backgroundColor: mode === 'light'
                ? 'rgba(1, 52, 39, 0.12)'
                : 'rgba(76, 175, 80, 0.24)',
            },
          },
        },
      },
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
});

export default theme;