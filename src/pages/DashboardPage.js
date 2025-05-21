import React from 'react';
import { useAuth } from '../context/AuthContext'; // To get user roles
import PatientDashboard from '../components/PatientDashboard';
import DentistDashboard from '../components/DentistDashboard';
import ClinicAdminDashboard from '../components/ClinicAdminDashboard';
import ReceptionistDashboard from '../components/ReceptionistDashboard';
import SystemAdminDashboard from '../components/SystemAdminDashboard';
import MultiRoleDashboardLayout from '../components/MultiRoleDashboardLayout';
import { Box, Container, Paper, Typography } from '@mui/material';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  // Ensure roles is always an array, even if currentUser or currentUser.roles is null/undefined
  const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : (currentUser?.role ? [currentUser.role] : []);

  // Determine which sections to show based on roles
  // A user might have multiple roles, so we show all relevant sections
  const showPatientSection = roles.includes('PATIENT');
  const showDentistSection = roles.includes('DENTIST');
  const showClinicAdminSection = roles.includes('CLINIC_ADMIN');
  const showReceptionistSection = roles.includes('RECEPTIONIST');
  const showSystemAdminSection = roles.includes('SYSTEM_ADMIN');

  const rolesWithComponents = [];
  if (showPatientSection) rolesWithComponents.push({ key: 'PATIENT', component: PatientDashboard });
  if (showDentistSection) rolesWithComponents.push({ key: 'DENTIST', component: DentistDashboard });
  if (showClinicAdminSection) rolesWithComponents.push({ key: 'CLINIC_ADMIN', component: ClinicAdminDashboard });
  if (showReceptionistSection) rolesWithComponents.push({ key: 'RECEPTIONIST', component: ReceptionistDashboard });
  if (showSystemAdminSection) rolesWithComponents.push({ key: 'SYSTEM_ADMIN', component: SystemAdminDashboard });

  // If no role-specific dashboards, show fallback message
  if (rolesWithComponents.length === 0) {
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

  // Multi-role layout (or single role)
  return <MultiRoleDashboardLayout rolesWithComponents={rolesWithComponents} />;
};

export default DashboardPage;