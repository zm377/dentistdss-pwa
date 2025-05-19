import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  Button,
  useMediaQuery,
  Menu,
  MenuItem,
  Badge // Added Badge
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import MailIcon from '@mui/icons-material/Mail'; // Added MailIcon
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleMobileMenuClose();
    logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) { // Adjust this value as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      position="fixed" // Changed from static to fixed
      elevation={darkMode ? 2 : (scrolled ? 4 : 0)} // Add shadow on scroll
      sx={{
        background: darkMode
          ? 'linear-gradient(to right, #013427, #014d40)'
          : theme.palette.primary.main,
        transition: 'background 0.5s ease, padding 0.3s ease, min-height 0.3s ease',
        width: '100%', // Ensure AppBar takes full width
        zIndex: theme.zIndex.drawer + 1, // Ensure header is above other content
        minHeight: scrolled && !isMobile ? '56px' : (isMobile ? '56px' : '64px'), // Adjust height on scroll for desktop
        paddingTop: scrolled && !isMobile ? theme.spacing(0.5) : (isMobile ? theme.spacing(0.5) : theme.spacing(1)),
        paddingBottom: scrolled && !isMobile ? theme.spacing(0.5) : (isMobile ? theme.spacing(0.5) : theme.spacing(1)),
      }}
    >
      <Toolbar sx={{
        flexWrap: 'wrap',
        // p: isMobile ? 1 : 2, // Original padding, now controlled by AppBar sx
        minHeight: scrolled && !isMobile ? '56px !important' : (isMobile ? '56px !important' : '64px !important'), // Ensure Toolbar respects AppBar's minHeight
        paddingLeft: isMobile ? theme.spacing(1) : theme.spacing(2),
        paddingRight: isMobile ? theme.spacing(1) : theme.spacing(2),
        transition: 'min-height 0.3s ease, padding 0.3s ease',
      }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <LocalHospitalIcon
            sx={{
              mr: 1,
              color: darkMode ? 'rgba(158, 255, 2, 0.92)' : 'inherit',
              filter: darkMode ? 'drop-shadow(0 0 2px rgba(248, 89, 45, 0.5))' : 'none',
              fontSize: isMobile ? '1.2rem' : (scrolled ? '1.8rem' : '3rem'), // Adjust icon size on scroll
              transition: 'font-size 0.3s ease',
            }}
          />
          <Typography
            variant={isMobile ? "body1" : (scrolled ? "subtitle1" : "h6")} // Adjust font size on scroll
            component="div"
            sx={{
              fontWeight: 'bold',
              color: darkMode ? '#e0f7fa' : 'inherit',
              textShadow: darkMode ? '0px 0px 8px rgba(224, 247, 250, 0.3)' : 'none',
              transition: 'font-size 0.3s ease',
            }}
          >
            DentistDSS
          </Typography>
        </Box>

        {/* Navigation Links - Only visible on desktop */}
        {!isMobile && (
          <>
            <Box sx={{ flexGrow: 1 }} /> {/* Added for centering */}
            <Box sx={{ display: 'flex' }}> {/* Removed ml: 4 */}
              <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              sx={{ mr: 1 }}
            >
              Home
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/chat"
              startIcon={<ChatIcon />}
              sx={{ mr: 1 }}
            >
              Chat
            </Button>
            
            <Button
              color="inherit"
              component={RouterLink}
              to="/quiz"
              startIcon={<QuizIcon />}
              sx={{ mr: 1 }}
            >
              Quiz
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/book"
              startIcon={<MenuBookIcon />}
              sx={{ mr: 1 }}
            >
              Book
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/learn"
              startIcon={<SchoolIcon />}
            >
              Learn
            </Button>
            </Box>
          </>
        )}
      

        <Box sx={{ flexGrow: 1 }} />

        {/* Theme Toggle Button - Always visible */}
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
          {darkMode ?
            <Brightness7Icon sx={{ color: '#ffeb3b', fontSize: isMobile ? '1.2rem' : '1.5rem' }} /> :
            <Brightness4Icon sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
          }
        </IconButton>

        {/* Desktop Auth Buttons/Info */}
        {!isMobile ? (
          isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="inherit"
                component={RouterLink} 
                to="/dashboard/messages" // Or wherever the message panel will be
                sx={{ mr: 1.5 }}
              >
                <Badge badgeContent={3} color="error"> {/* Placeholder unread count */}
                  <MailIcon />
                </Badge>
              </IconButton>
              <Typography sx={{ mr: 2, color: darkMode ? '#e0f7fa' : 'inherit' }}>
                {currentUser?.email || 'User'}
              </Typography>
              <Button color="inherit" onClick={logout} variant="outlined" size="small">
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 1 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
                variant="outlined"
              >
                Sign Up
              </Button>
            </Box>
          )
        ) : (
          /* Mobile Menu Icon */
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={handleMobileMenuOpen}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          open={Boolean(mobileMenuAnchorEl)}
          onClose={handleMobileMenuClose}
          slotProps={{
            paper: {
              sx: {
                mt: 1.5,
                width: 200,
              }
            }
          }}
        >
          {/* Navigation Links - Always visible in mobile menu */}
          <MenuItem
            component={RouterLink}
            to="/"
            onClick={handleMobileMenuClose}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon fontSize="small" sx={{ mr: 1 }} />
              Home
            </Box>
          </MenuItem>

          {isAuthenticated && (
            <MenuItem
              component={RouterLink}
              to="/chat"
              onClick={handleMobileMenuClose}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChatIcon fontSize="small" sx={{ mr: 1 }} />
                Chat
              </Box>
            </MenuItem>
          )}
          <MenuItem
            component={RouterLink}
            to="/quiz"
            onClick={handleMobileMenuClose}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <QuizIcon fontSize="small" sx={{ mr: 1 }} />
              Quiz
            </Box>
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to="/book"
            onClick={handleMobileMenuClose}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />
              Book
            </Box>
          </MenuItem>
          <MenuItem
            component={RouterLink}
            to="/learn"
            onClick={handleMobileMenuClose}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
              Learn
            </Box>
          </MenuItem>

          <Box sx={{ my: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }} />

          {isAuthenticated ? (
            [
              <MenuItem disabled key="user-email">
                <Typography variant="body2" noWrap>
                  {currentUser?.email || 'User'}
                </Typography>
              </MenuItem>,
              <MenuItem onClick={handleLogout} key="logout">Logout</MenuItem>
            ]
          ) : (
            [
              <MenuItem
                component={RouterLink}
                to="/login"
                onClick={handleMobileMenuClose}
                key="mobile-login"
              >
                Login
              </MenuItem>,
              <MenuItem
                component={RouterLink}
                to="/signup"
                onClick={handleMobileMenuClose}
                key="mobile-signup"
              >
                Sign Up
              </MenuItem>
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;