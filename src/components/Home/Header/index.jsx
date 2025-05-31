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
  Badge,
  Avatar,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import QuizIcon from '@mui/icons-material/Quiz';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import MailIcon from '@mui/icons-material/Mail';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../context/auth';
import { NotificationBell } from '../../NotificationSystem';

const Header = ({ darkMode, toggleDarkMode, currentUser }) => {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
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

  const getDisplayName = () => {
    if (!currentUser) return 'Guest';
    if (currentUser.firstName || currentUser.lastName) {
      return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
    }
    return currentUser.name || currentUser.username || currentUser.email || 'User';
  };

  const getInitials = () => {
    if (!currentUser) return '?';
    const first = currentUser.firstName || currentUser.name?.split(' ')[0] || '';
    const last = currentUser.lastName || currentUser.name?.split(' ')[1] || '';
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (first) return first[0].toUpperCase();
    if (currentUser.email) return currentUser.email[0].toUpperCase();
    return '?';
  };

  const avatarSrc = currentUser?.avatarUrl || currentUser?.photoURL || currentUser?.profilePicture || '';

  return (
    <AppBar
      position="fixed"
      elevation={darkMode ? 2 : (scrolled ? 4 : 0)}
      sx={{
        background: darkMode
          ? 'linear-gradient(to right, #013427, #014d40)'
          : theme.palette.primary.main,
        transition: 'background 0.5s ease, padding 0.3s ease, min-height 0.3s ease',
        width: '100%',
        zIndex: theme.zIndex.drawer + 1,
        minHeight: scrolled && !isMobile ? '56px' : (isMobile ? '56px' : '64px'),
        paddingTop: scrolled && !isMobile ? theme.spacing(0.5) : (isMobile ? theme.spacing(0.5) : theme.spacing(1)),
        paddingBottom: scrolled && !isMobile ? theme.spacing(0.5) : (isMobile ? theme.spacing(0.5) : theme.spacing(1)),
      }}
    >
      <Toolbar sx={{
        flexWrap: 'wrap',
        minHeight: scrolled && !isMobile ? '56px !important' : (isMobile ? '56px !important' : '64px !important'),
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
              fontSize: isMobile ? '1.2rem' : (scrolled ? '1.8rem' : '3rem'),
              transition: 'font-size 0.3s ease',
            }}
          />
          <Typography
            variant={isMobile ? "body1" : (scrolled ? "subtitle1" : "h6")}
            component="div"
            sx={{
              fontWeight: 'bold',
              color: darkMode ? '#e0f7fa' : 'inherit',
              textShadow: darkMode ? '0px 0px 8px rgba(224, 247, 250, 0.3)' : 'none',
              transition: 'font-size 0.3s ease',
            }}
          >
            Dentabot
          </Typography>
        </Box>

        {!isMobile && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex' }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

          {currentUser && <NotificationBell />}

          {!isMobile ? (
            isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard/messages"
                  sx={{ mr: 1.5 }}
                >
                  <Badge badgeContent={3} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard"
                  variant="outlined"
                  size="small"
                >
                  Dashboard
                </Button>
              </>
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
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              size="small"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

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
                  {getDisplayName()}
                </Typography>
              </MenuItem>,
              <MenuItem
                component={RouterLink}
                to="/dashboard"
                onClick={handleMobileMenuClose}
                key="dashboard"
              >
                Dashboard
              </MenuItem>
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

        {/* Profile menu */}
        {currentUser && (
          <>
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 1 }}
            >
              <Avatar
                src={avatarSrc}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: !avatarSrc ? 'primary.main' : 'transparent',
                }}
              >
                {!avatarSrc && getInitials()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>
                <Typography variant="subtitle2">{getDisplayName()}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem component={RouterLink} to="/profile" onClick={handleProfileMenuClose}>
                <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem component={RouterLink} to="/settings" onClick={handleProfileMenuClose}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem component={RouterLink} to="/dashboard" onClick={handleProfileMenuClose}>
                <ListItemIcon><HomeIcon fontSize="small" /></ListItemIcon>
                Dashboard
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;