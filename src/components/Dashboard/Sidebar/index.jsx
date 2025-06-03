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
  useMediaQuery,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { getDisplayName, getInitials } from '../../../utils/dashboard/dashboardUtils';
import { roleMeta } from '../../../utils/dashboard/roleConfig';
import { TOUCH_TARGETS, getResponsivePadding } from '../../../utils/mobileOptimization';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const avatarSrc = currentUser?.avatarUrl || currentUser?.photoURL || currentUser?.profilePicture || '';
  const displayName = getDisplayName(currentUser);
  const displayInitials = getInitials(currentUser);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: getResponsivePadding('medium'),
        ...theme.mixins.toolbar,
        backgroundColor: 'primary.main',
        color: 'white',
        minHeight: { xs: 56, sm: 64 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospitalIcon sx={{
            mr: { xs: 1, sm: 1.5 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }} />
          <Typography
            variant={isSmallMobile ? "subtitle1" : "h6"}
            noWrap
            component="div"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Dentabot
          </Typography>
        </Box>
        {!isSmUp && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{
              ml: 1,
              minWidth: TOUCH_TARGETS.MINIMUM,
              minHeight: TOUCH_TARGETS.MINIMUM
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />

      <Box sx={{
        p: getResponsivePadding('medium'),
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar src={avatarSrc} sx={{
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          mr: { xs: 1.5, sm: 2 },
          bgcolor: !avatarSrc ? 'primary.main' : 'transparent',
          color: !avatarSrc ? 'primary.contrastText' : 'inherit'
        }}>
          {!avatarSrc && displayInitials}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant={isSmallMobile ? "body1" : "subtitle1"}
            sx={{
              fontWeight: 'medium',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {roleMeta[activeRoleKey]?.label || activeRoleKey}
          </Typography>
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
                    py: { xs: 1.5, sm: 1 },
                    minHeight: TOUCH_TARGETS.MINIMUM,
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
                    minWidth: { xs: '32px', sm: '36px' }
                  }}>{roleMeta[key]?.icon}</ListItemIcon>
                  <ListItemText
                    primary={roleMeta[key]?.label || key}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: activeRoleKey === key ? 'bold' : 'regular',
                          fontSize: { xs: '0.85rem', sm: '0.9rem' }
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
                py: { xs: 1.5, sm: 1 },
                minHeight: TOUCH_TARGETS.MINIMUM,
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
                minWidth: { xs: '32px', sm: '36px' }
              }}>{section.icon}</ListItemIcon>
              <ListItemText
                primary={section.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: section.key === activeSectionKey ? 'medium' : 'regular',
                      fontSize: { xs: '0.85rem', sm: '0.9rem' }
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
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="dashboard navigation">
      <Drawer
        variant={isSmUp ? 'permanent' : 'temporary'}
        open={isSmUp ? true : mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better for SEO and accessibility
          sx: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create(['background-color'], {
              duration: theme.transitions.duration.standard,
            }),
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
