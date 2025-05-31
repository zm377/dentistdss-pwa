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
    Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: `calc(100% - ${240}px)` },
                ml: { sm: `${240}px` },
                boxShadow: darkMode ? 2 : 1,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                transition: theme.transitions.create(['background-color', 'box-shadow'], {
                    duration: theme.transitions.duration.standard,
                }),
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {activeSectionLabel}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                        <IconButton
                            onClick={toggleDarkMode}
                            color="inherit"
                            sx={{
                                mr: 1,
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
                                <Brightness7Icon sx={{ color: theme.palette.mode === 'dark' ? '#ffeb3b' : 'inherit' }} />
                            ) : (
                                <Brightness4Icon />
                            )}
                        </IconButton>
                    </Tooltip>

                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleUserMenuOpen}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <AccountCircleIcon />
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
                >
                    {hasMultipleRoles && (
                        <MenuItem onClick={handleUserMenuClose}>Switch Role</MenuItem>
                    )}
                    <MenuItem onClick={logout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
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
