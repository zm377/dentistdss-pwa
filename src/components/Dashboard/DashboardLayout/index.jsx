import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  useTheme,
  useMediaQuery,
  Alert,
} from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth';
import { DashboardProvider } from '../../../context/dashboard/DashboardContext';
import { useDashboardNavigation } from '../../../hooks/dashboard/useDashboardNavigation';
import DashboardErrorBoundary from '../../ErrorBoundary/DashboardErrorBoundary';
import Header from '../Header';
import Sidebar from '../Sidebar';
import PageContainer from '../PageContainer';


const drawerWidth = 240;

/**
 * Internal Dashboard Layout Component
 * Uses dashboard context and hooks for state management
 */
const DashboardLayoutInternal = ({ darkMode, toggleDarkMode, logout }) => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const { currentUser } = useAuth();

  // Use dashboard navigation hook
  const {
    activeRoleKey,
    activeRoleSections,
    currentSection,
    roleRoutes,
    rolesWithComponents,
    mobileOpen,
    userMenuAnchorEl,
    activeSectionLabel,
    hasMultipleRoles,
    handleRoleChange,
    handleSectionChange,
    handleDrawerToggle,
    handleUserMenuOpen,
    handleUserMenuClose,
  } = useDashboardNavigation();

  // Show loading or error states
  if (!currentUser) {
    return <Alert severity="warning">Please log in to access the dashboard.</Alert>;
  }

  if (rolesWithComponents.length === 0) {
    return <Alert severity="info">No dashboard roles available for your account.</Alert>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Header */}
      <Header
        isSmUp={isSmUp}
        handleDrawerToggle={handleDrawerToggle}
        activeSectionLabel={activeSectionLabel}
        userMenuAnchorEl={userMenuAnchorEl}
        handleUserMenuOpen={handleUserMenuOpen}
        handleUserMenuClose={handleUserMenuClose}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        logout={logout}
        hasMultipleRoles={hasMultipleRoles}
      />

      {/* Sidebar */}
      <Sidebar
        isSmUp={isSmUp}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        currentUser={currentUser}
        activeRoleKey={activeRoleKey}
        rolesWithComponents={rolesWithComponents}
        setActiveRoleKey={handleRoleChange}
        activeRoleSections={activeRoleSections}
        activeSectionKey={currentSection?.key}
        setActiveSectionKey={handleSectionChange}
        logout={logout}
      />

      {/* Main Content with Routes */}
      <PageContainer drawerWidth={drawerWidth}>
        <Routes>
          {/* Generate routes for role-specific sections */}
          {roleRoutes.map((route) => (
            <Route
              key={route.key}
              path={route.path}
              element={
                <route.component
                  {...route.props}
                  clinicId={currentUser?.clinicId}
                />
              }
            />
          ))}

          {/* Default redirect */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  activeRoleSections.length > 0
                    ? activeRoleSections[0]?.path || '/overview'
                    : '/overview'
                }
                replace
              />
            }
          />

          {/* 404 for invalid routes */}
          <Route
            path="*"
            element={
              <Alert severity="error">
                Page not found. Please select a valid section from the sidebar.
              </Alert>
            }
          />
        </Routes>
      </PageContainer>
    </Box>
  );
};

DashboardLayoutInternal.propTypes = {
  /** Whether dark mode is enabled */
  darkMode: PropTypes.bool,
  /** Function to toggle dark mode */
  toggleDarkMode: PropTypes.func,
  /** Logout function */
  logout: PropTypes.func.isRequired,
};

/**
 * Main Dashboard Layout Component with Context Provider
 * Wraps the internal component with necessary providers
 */
const DashboardLayout = ({ roles = [], ...props }) => {
  return (
    <DashboardErrorBoundary>
      <DashboardProvider roles={roles}>
        <DashboardLayoutInternal {...props} />
      </DashboardProvider>
    </DashboardErrorBoundary>
  );
};

DashboardLayout.propTypes = {
  /** Whether dark mode is enabled */
  darkMode: PropTypes.bool,
  /** Function to toggle dark mode */
  toggleDarkMode: PropTypes.func,
  /** Array of role strings */
  roles: PropTypes.arrayOf(PropTypes.string),
  /** Logout function */
  logout: PropTypes.func.isRequired,
};

export default DashboardLayout;
