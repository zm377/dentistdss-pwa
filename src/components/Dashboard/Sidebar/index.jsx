import React from 'react';
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
  Typography,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { getDisplayName, getInitials } from '../../../utils/dashboard/dashboardUtils';
import { roleMeta } from '../../../utils/dashboard/roleConfig';

// Assuming roleMeta and drawerWidth are defined elsewhere or passed as props
// For simplicity, I'll pass them as props here.

const Sidebar = ({
  isSmUp,
  mobileOpen,
  handleDrawerToggle,
  drawerWidth,
  currentUser,
  activeRoleKey,
  rolesWithComponents,
  setActiveRoleKey,
  activeRoleSections,
  activeSectionKey,
  setActiveSectionKey,
  logout,
}) => {
  const theme = useTheme();

  const avatarSrc = currentUser?.avatarUrl || currentUser?.photoURL || currentUser?.profilePicture || '';
  const displayName = getDisplayName(currentUser);
  const displayInitials = getInitials(currentUser);

  const drawerContent = (
    <div>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 2), ...theme.mixins.toolbar,
        backgroundColor: 'primary.main',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospitalIcon sx={{ mr: 1.5, fontSize: '1.5rem' }} />
          <Typography variant="h6" noWrap component="div">Dentabot</Typography>
        </Box>
        {!isSmUp && (<IconButton edge="end" color="inherit" onClick={handleDrawerToggle}
          sx={{ ml: 1 }}><ChevronLeftIcon /></IconButton>)}
      </Toolbar>
      <Divider />

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src={avatarSrc} sx={{
          width: 40,
          height: 40,
          mr: 2,
          bgcolor: !avatarSrc ? 'primary.main' : 'transparent',
          color: !avatarSrc ? 'primary.contrastText' : 'inherit'
        }}>
          {!avatarSrc && displayInitials}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{displayName}</Typography>
          <Typography variant="body2"
            color="text.secondary">{roleMeta[activeRoleKey]?.label || activeRoleKey}</Typography>
        </Box>
      </Box>
      <Divider />

      {rolesWithComponents.length > 1 && (
        <>
          <Typography variant="overline"
            sx={{ pl: 3, pt: 2, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>My
            Roles</Typography>
          <List component="nav" sx={{ px: 1 }}>
            {rolesWithComponents.map(({ key }) => (
              <ListItem key={key} disablePadding>
                <ListItemButton
                  selected={key === activeRoleKey}
                  onClick={() => {
                    setActiveRoleKey(key);
                    if (!isSmUp) handleDrawerToggle(); // Close mobile drawer on selection
                  }}
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { backgroundColor: 'primary.dark' }
                    },
                    '&:hover': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)' },
                    my: 0.5
                  }}
                >
                  <ListItemIcon sx={{
                    color: activeRoleKey === key ? 'inherit' : 'text.secondary',
                    minWidth: '36px'
                  }}>{roleMeta[key]?.icon}</ListItemIcon>
                  <ListItemText
                    primary={roleMeta[key]?.label || key}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: activeRoleKey === key ? 'bold' : 'regular',
                          fontSize: '0.9rem'
                        }
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 1 }} />
        </>
      )}

      <Typography variant="overline" sx={{
        pl: 3,
        pt: 2,
        display: 'block',
        color: 'text.secondary',
        fontWeight: 'bold'
      }}>{roleMeta[activeRoleKey]?.label || 'Dashboard'}</Typography>
      <List component="nav" sx={{ px: 1 }}>
        {activeRoleSections.map((section) => (
          <ListItem key={section.key} disablePadding>
            <ListItemButton
              selected={section.key === activeSectionKey}
              onClick={() => {
                setActiveSectionKey(section.key);
                if (!isSmUp) handleDrawerToggle(); // Close mobile drawer on selection
              }}
              sx={{
                borderRadius: 1,
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.16)',
                  '&:hover': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.24)' }
                },
                '&:hover': { backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)' },
                my: 0.5
              }}
            >
              <ListItemIcon sx={{
                color: section.key === activeSectionKey ? 'primary.main' : 'text.secondary',
                minWidth: '36px'
              }}>{section.icon}</ListItemIcon>
              <ListItemText
                primary={section.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: section.key === activeSectionKey ? 'medium' : 'regular',
                      fontSize: '0.9rem'
                    }
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ py: 1.5 }} onClick={logout}>
              <ListItemIcon sx={{ minWidth: '36px' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box> */}
    </div>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="dashboard navigation">
      <Drawer
        variant={isSmUp ? 'permanent' : 'temporary'}
        open={isSmUp ? true : mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better for SEO and accessibility
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#1A2027',
            color: theme.palette.mode === 'light' ? '#1A2027' : '#FFFFFF'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  isSmUp: PropTypes.bool.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
  activeRoleKey: PropTypes.string,
  rolesWithComponents: PropTypes.array.isRequired,
  setActiveRoleKey: PropTypes.func.isRequired,
  roleMeta: PropTypes.object.isRequired,
  activeRoleSections: PropTypes.array.isRequired,
  activeSectionKey: PropTypes.string.isRequired,
  setActiveSectionKey: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  getDisplayName: PropTypes.func.isRequired,
  getInitials: PropTypes.func.isRequired,
};

export default Sidebar;
