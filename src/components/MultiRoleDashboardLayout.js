import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  CssBaseline,
  useMediaQuery,
  AppBar,
  Typography,
  Divider,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MailIcon from '@mui/icons-material/Mail';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';

// Adjusted drawer width to be slightly narrower
const drawerWidth = 240;

const roleMeta = {
  DASHBOARD: { label: 'Dashboard', icon: <DashboardIcon /> },
  USERS: { label: 'Users', icon: <PeopleIcon /> },
  ANALYTICS: { label: 'Analytics', icon: <BarChartIcon /> },
  ORDERS: { label: 'Orders', icon: <ShoppingCartIcon /> },
  MESSAGES: { label: 'Messages', icon: <MailIcon /> },
  SETTINGS: { label: 'Settings', icon: <SettingsIcon /> },
  PATIENT: { label: 'Patient', icon: <PersonIcon /> },
  DENTIST: { label: 'Dentist', icon: <MedicalServicesIcon /> },
  CLINIC_ADMIN: { label: 'Clinic Admin', icon: <AdminPanelSettingsIcon /> },
  RECEPTIONIST: { label: 'Receptionist', icon: <SupportAgentIcon /> },
  SYSTEM_ADMIN: { label: 'System Admin', icon: <SettingsIcon /> },
};

/**
 * MultiRoleDashboardLayout
 * Renders a persistent drawer on desktop (temporary on mobile) to switch between dashboards.
 * rolesWithComponents: Array of objects with shape { key: roleKey, component: ReactComponent }
 */
const MultiRoleDashboardLayout = ({ rolesWithComponents }) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeRoleKey, setActiveRoleKey] = useState(rolesWithComponents[0]?.key);
  const [activeSectionKey, setActiveSectionKey] = useState('overview');
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);

  const { currentUser } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const activeRoleWithComponent = rolesWithComponents.find(r => r.key === activeRoleKey) || null;
  const ActiveComponent = activeRoleWithComponent?.component || null;
  
  // Get navigation items for the active dashboard
  const activeRoleSections = ActiveComponent?.navigationSections || [
    { key: 'overview', label: 'Overview', icon: <DashboardIcon /> }
  ];

  // Helper to derive display name & initials
  const getDisplayName = (user) => {
    if (!user) return 'Guest';
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    if (user.name) return user.name;
    if (user.username) return user.username;
    return user.email || 'User';
  };

  const getInitials = (user) => {
    if (!user) return '?';
    const first = user.firstName || user.name?.split(' ')[0] || '';
    const last = user.lastName || user.name?.split(' ')[1] || '';
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (first) return first[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  };

  const avatarSrc = currentUser?.avatarUrl || currentUser?.photoURL || currentUser?.profilePicture || '';
  const displayName = getDisplayName(currentUser);
  const displayInitials = getInitials(currentUser);

  const drawerContent = (
    <div>
      {/* Sidebar Header */}
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: theme.spacing(0, 2), 
          ...theme.mixins.toolbar, 
          backgroundColor: 'primary.main', 
          color: 'white' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Brightness4Icon sx={{ mr: 1.5, fontSize: '1.5rem' }} />
          <Typography variant="h6" noWrap component="div">
            Dentabot
          </Typography>
        </Box>
        {!isSmUp && (
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleDrawerToggle}
            sx={{ ml: 1 }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      
      {/* User profile section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={avatarSrc}
          sx={{ width: 40, height: 40, mr: 2, bgcolor: !avatarSrc ? 'primary.main' : 'transparent', color: !avatarSrc ? 'primary.contrastText' : 'inherit' }}
        >
          {!avatarSrc && displayInitials}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {roleMeta[activeRoleKey]?.label || activeRoleKey}
          </Typography>
        </Box>
      </Box>
      <Divider />

      {/* Role selection */}
      {rolesWithComponents.length > 1 && (
        <>
          <Typography 
            variant="overline" 
            sx={{ 
              pl: 3, 
              pt: 2, 
              display: 'block', 
              color: 'text.secondary', 
              fontWeight: 'bold' 
            }}
          >
            My Roles
          </Typography>
          <List component="nav" sx={{ px: 1 }}>
            {rolesWithComponents.map(({ key }) => (
              <ListItem key={key} disablePadding>
                <ListItemButton
                  selected={key === activeRoleKey}
                  onClick={() => {
                    setActiveRoleKey(key);
                    setActiveSectionKey('overview');
                    if (!isSmUp) {
                      setMobileOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(0, 0, 0, 0.04)' 
                        : 'rgba(255, 255, 255, 0.08)',
                    },
                    my: 0.5,
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: activeRoleKey === key ? 'inherit' : 'text.secondary',
                      minWidth: '36px' 
                    }}
                  >
                    {roleMeta[key]?.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={roleMeta[key]?.label || key} 
                    primaryTypographyProps={{ 
                      fontWeight: activeRoleKey === key ? 'bold' : 'regular',
                      fontSize: '0.9rem'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 1 }} />
        </>
      )}

      {/* Dashboard-specific navigation */}
      <Typography 
        variant="overline" 
        sx={{ 
          pl: 3, 
          pt: 2, 
          display: 'block', 
          color: 'text.secondary', 
          fontWeight: 'bold' 
        }}
      >
        {roleMeta[activeRoleKey]?.label || 'Dashboard'}
      </Typography>
      <List component="nav" sx={{ px: 1 }}>
        {activeRoleSections.map((section) => (
          <ListItem key={section.key} disablePadding>
            <ListItemButton
              selected={section.key === activeSectionKey}
              onClick={() => {
                setActiveSectionKey(section.key);
                if (!isSmUp) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: 1,
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.16)',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.24)',
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                },
                my: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: section.key === activeSectionKey ? 'primary.main' : 'text.secondary', minWidth: '36px' }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText 
                primary={section.label} 
                primaryTypographyProps={{ 
                  fontWeight: section.key === activeSectionKey ? 'medium' : 'regular',
                  fontSize: '0.9rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom section with logout */}
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: '36px' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  if (rolesWithComponents.length === 0) return null; // safety

  const hasMultipleRoles = rolesWithComponents.length > 1;

  // Calculate content maxWidth based on screen size
  const getContentMaxWidth = () => {
    if (isLgUp) return '1280px';
    if (isMdUp) return '960px';
    return '100%';
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <CssBaseline />

      {/* AppBar for main content area */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + (hasMultipleRoles && !isSmUp ? 1 : -1),
        }}
      >
        <Toolbar>
          {!isSmUp && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {activeRoleSections.find(section => section.key === activeSectionKey)?.label || 'Dashboard'}
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleUserMenuOpen}
            aria-controls="profile-menu"
            aria-haspopup="true"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="dashboard navigation">
        <Drawer
          variant={isSmUp ? 'permanent' : 'temporary'}
          open={isSmUp ? true : mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1A2027',
              color: theme.palette.mode === 'light' ? '#1A2027' : '#FFFFFF',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          overflow: 'auto',
          backgroundColor: theme.palette.mode === 'light' ? '#F4F6F8' : '#121212',
          p: { xs: 2, md: 3 },
        }}
      >
        <Toolbar />
        <Container 
          maxWidth={false} 
          sx={{ 
            maxWidth: getContentMaxWidth(),
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {ActiveComponent ? <ActiveComponent activeSection={activeSectionKey} /> : null}
        </Container>
      </Box>
    </Box>
  );
};

MultiRoleDashboardLayout.propTypes = {
  rolesWithComponents: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      component: PropTypes.elementType.isRequired,
    })
  ).isRequired,
};

export default MultiRoleDashboardLayout; 