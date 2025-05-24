import React from 'react';
import { useAuth } from '../context/AuthContext'; // To get user roles
import MultiRoleDashboardLayout from '../components/MultiRoleDashboardLayout';
import { Box, Container, Paper, Typography } from '@mui/material';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  // Ensure roles is always an array, even if currentUser or currentUser.roles is null/undefined
  const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : (currentUser?.role ? [currentUser.role] : []);

  // If user has no roles recognised by the system, show fallback message
  if (roles.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No dashboard available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your account does not have any associated dashboard access. Please contact support if you believe this is an error.
          </Typography>
          {currentUser && (
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
              (Detected roles: {roles.join(', ') || 'None'})
            </Typography>
          )}
        </Paper>
      </Container>
    );
  }

  // Render the unified multi-role dashboard. We simply pass the role list –
  // the layout component now handles mapping roles → dashboards internally.
  return <MultiRoleDashboardLayout roles={roles} />;
};

export default DashboardPage;