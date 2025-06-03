import React from 'react';
import PropTypes from 'prop-types';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Menu,
    MenuItem,
    Avatar,
    useTheme,
    useMediaQuery,
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { TOUCH_TARGETS } from '../../../utils/mobileOptimization';

const Header = ({
    isSmUp,
    handleDrawerToggle,
    activeSectionLabel,
    userMenuAnchorEl,
    handleUserMenuOpen,
    handleUserMenuClose,
    darkMode,
    toggleDarkMode,
    logout,
    hasMultipleRoles,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar
            position="fixed"
            elevation={darkMode ? 2 : 1}
            sx={{
                width: { sm: `calc(100% - ${240}px)` },
                ml: { sm: `${240}px` },
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderBottom: `1px solid ${theme.palette.divider}`,
                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                    duration: theme.transitions.duration.standard,
                }),
                minHeight: { xs: 56, sm: 64 },
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    minHeight: { xs: 56, sm: 64 },
                    px: { xs: 1, sm: 2 }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: { xs: 1, sm: 2 },
                            display: { sm: 'none' },
                            minWidth: TOUCH_TARGETS.MINIMUM,
                            minHeight: TOUCH_TARGETS.MINIMUM
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                    >
                        {activeSectionLabel}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                        <IconButton
                            onClick={toggleDarkMode}
                            color="inherit"
                            size={isSmallMobile ? "small" : "medium"}
                            sx={{
                                minWidth: TOUCH_TARGETS.MINIMUM,
                                minHeight: TOUCH_TARGETS.MINIMUM,
                                transition: theme.transitions.create('transform', {
                                    duration: theme.transitions.duration.shorter,
                                }),
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            {darkMode ? (
                                <Brightness7Icon sx={{
                                    color: theme.palette.mode === 'dark' ? '#ffeb3b' : 'inherit',
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                                }} />
                            ) : (
                                <Brightness4Icon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                            )}
                        </IconButton>
                    </Tooltip>

                    <IconButton
                        size={isSmallMobile ? "small" : "medium"}
                        edge="end"
                        aria-label="account menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleUserMenuOpen}
                        color="inherit"
                        sx={{
                            minWidth: TOUCH_TARGETS.MINIMUM,
                            minHeight: TOUCH_TARGETS.MINIMUM
                        }}
                    >
                        <Avatar sx={{
                            width: { xs: 28, sm: 32 },
                            height: { xs: 28, sm: 32 },
                            bgcolor: 'primary.main'
                        }}>
                            <AccountCircleIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                        </Avatar>
                    </IconButton>
                </Box>

                <Menu
                    id="menu-appbar"
                    anchorEl={userMenuAnchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                        sx: {
                            mt: 1,
                            minWidth: 160,
                            borderRadius: 2,
                            boxShadow: theme.shadows[8],
                        }
                    }}
                >
                    {hasMultipleRoles && (
                        <MenuItem
                            onClick={handleUserMenuClose}
                            sx={{
                                minHeight: TOUCH_TARGETS.MINIMUM,
                                px: 2,
                                py: 1.5,
                                fontSize: { xs: '0.9rem', sm: '1rem' }
                            }}
                        >
                            Switch Role
                        </MenuItem>
                    )}
                    <MenuItem
                        onClick={logout}
                        sx={{
                            minHeight: TOUCH_TARGETS.MINIMUM,
                            px: 2,
                            py: 1.5,
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            color: 'error.main'
                        }}
                    >
                        <LogoutIcon
                            fontSize="small"
                            sx={{
                                mr: 1.5,
                                fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                        />
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

Header.propTypes = {
    isSmUp: PropTypes.bool.isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
    activeSectionLabel: PropTypes.string.isRequired,
    userMenuAnchorEl: PropTypes.object,
    handleUserMenuOpen: PropTypes.func.isRequired,
    handleUserMenuClose: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    hasMultipleRoles: PropTypes.bool.isRequired,
};

export default Header;
