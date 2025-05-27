import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { NotificationBell } from '../../NotificationSystem';

const Header = ({ darkMode, toggleDarkMode, currentUser, logout }) => {
  const theme = useTheme();
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

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
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {/* Logo and Title */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            mr: 2,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Dentabot
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right side controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme toggle */}
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Notifications */}
          {currentUser && <NotificationBell />}

          {/* Profile menu */}
          {currentUser ? (
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
                  <ListItemIcon><SettingsIcon fontSize="small"/></ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small"/></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              component={RouterLink}
              to="/login"
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 