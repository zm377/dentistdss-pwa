import React, { useEffect } from 'react';
import { Box, Typography, Container, Paper, Grid, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // To get user roles
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SettingsIcon from '@mui/icons-material/Settings';
import { blue, green, orange, purple, red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

// Placeholder components for different roles - these would be actual components
const PatientSection = () => (
  <Card sx={{ mb: 2, height: '100%' }}>
    <CardHeader 
      avatar={<Avatar sx={{ bgcolor: blue[500] }}><PersonIcon /></Avatar>}
      title="Patient Dashboard" 
      titleTypographyProps={{ variant: 'h6' }}
    />
    <CardContent>
      <Typography variant="body1">Access your appointments, treatment history, and personal information.</Typography>
      {/* Example: <Button variant="outlined" sx={{mt: 2}}>View Appointments</Button> */}
    </CardContent>
  </Card>
);

const DentistSection = () => (
  <Card sx={{ mb: 2, height: '100%' }}>
    <CardHeader 
      avatar={<Avatar sx={{ bgcolor: green[500] }}><MedicalServicesIcon /></Avatar>}
      title="Dentist Dashboard" 
      titleTypographyProps={{ variant: 'h6' }}
    />
    <CardContent>
      <Typography variant="body1">Manage your daily schedule, patient records, and treatment plans.</Typography>
      {/* Example: <Button variant="outlined" sx={{mt: 2}}>View Schedule</Button> */}
    </CardContent>
  </Card>
);

const ClinicAdminSection = () => (
  <Card sx={{ mb: 2, height: '100%' }}>
    <CardHeader 
      avatar={<Avatar sx={{ bgcolor: orange[500] }}><AdminPanelSettingsIcon /></Avatar>}
      title="Clinic Admin Dashboard" 
      titleTypographyProps={{ variant: 'h6' }}
    />
    <CardContent>
      <Typography variant="body1">Oversee clinic operations, manage staff, and view analytics.</Typography>
      {/* Example: <Button variant="outlined" sx={{mt: 2}}>Manage Staff</Button> */}
    </CardContent>
  </Card>
);

const ReceptionistSection = () => (
  <Card sx={{ mb: 2, height: '100%' }}>
    <CardHeader 
      avatar={<Avatar sx={{ bgcolor: purple[500] }}><SupportAgentIcon /></Avatar>}
      title="Receptionist Dashboard" 
      titleTypographyProps={{ variant: 'h6' }}
    />
    <CardContent>
      <Typography variant="body1">Manage patient appointments, check-ins, and communication.</Typography>
      {/* Example: <Button variant="outlined" sx={{mt: 2}}>Book Appointment</Button> */}
    </CardContent>
  </Card>
);

const SystemAdminSection = () => (
  <Card sx={{ mb: 2, height: '100%' }}>
    <CardHeader 
      avatar={<Avatar sx={{ bgcolor: red[500] }}><SettingsIcon /></Avatar>}
      title="System Admin Dashboard" 
      titleTypographyProps={{ variant: 'h6' }}
    />
    <CardContent>
      <Typography variant="body1">Manage overall system settings, user accounts, and platform health.</Typography>
      {/* Example: <Button variant="outlined" sx={{mt: 2}}>User Management</Button> */}
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect users whose account is still pending approval.
  // useEffect(() => {
  //   if (currentUser?.approvalStatus === 'pending') {
  //     navigate('/pending-approval', { replace: true });
  //   }
  // }, [currentUser?.approvalStatus, navigate]);
  // Above logic removed as only approved users should be able to log in and reach the dashboard.

  // Ensure roles is always an array, even if currentUser or currentUser.roles is null/undefined
  const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : (currentUser?.role ? [currentUser.role] : []);

  // Determine which sections to show based on roles
  // A user might have multiple roles, so we show all relevant sections
  const showPatientSection = roles.includes('PATIENT');
  const showDentistSection = roles.includes('DENTIST');
  const showClinicAdminSection = roles.includes('CLINIC_ADMIN');
  const showReceptionistSection = roles.includes('RECEPTIONIST');
  const showSystemAdminSection = roles.includes('SYSTEM_ADMIN');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: { xs: 2, md: 4 }, textAlign: 'center', fontWeight: 'medium' }}>
          Welcome, {currentUser?.firstName || 'User'}!
        </Typography>
        <Typography variant="h6" component="h2" sx={{ mb: { xs: 3, md: 5 }, textAlign: 'center', color: 'text.secondary' }}>
          Here's an overview of your accessible features:
        </Typography>

        <Grid container spacing={3}>
          {/* Conditionally render sections based on user roles */} 
          {showPatientSection && (
            <Grid item xs={12} sm={6} md={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12} lg={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 2 ? 4 : (roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12)}>
              <PatientSection />
            </Grid>
          )}
          {showDentistSection && (
            <Grid item xs={12} sm={6} md={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12} lg={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 2 ? 4 : (roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12)}>
              <DentistSection />
            </Grid>
          )}
          {showClinicAdminSection && (
            <Grid item xs={12} sm={6} md={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12} lg={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 2 ? 4 : (roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12)}>
              <ClinicAdminSection />
            </Grid>
          )}
          {showReceptionistSection && (
            <Grid item xs={12} sm={6} md={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12} lg={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 2 ? 4 : (roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12)}>
              <ReceptionistSection />
            </Grid>
          )}
          {showSystemAdminSection && (
            <Grid item xs={12} sm={6} md={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12} lg={roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 2 ? 4 : (roles.filter(r => ['PATIENT', 'DENTIST', 'CLINIC_ADMIN', 'RECEPTIONIST', 'SYSTEM_ADMIN'].includes(r)).length > 1 ? 6 : 12)}>
              <SystemAdminSection />
            </Grid>
          )}

          {/* Fallback if no specific role sections are matched or user has no roles */} 
          {!showPatientSection && !showDentistSection && !showClinicAdminSection && !showReceptionistSection && !showSystemAdminSection && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p:3, textAlign: 'center', backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey[800]' : 'grey[100]'}}>
                <Typography variant="h6" gutterBottom>
                  No specific dashboard sections available for your current role(s).
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please contact support if you believe this is an error.
                </Typography>
                {currentUser && (
                  <Typography variant="caption" display="block" sx={{ textAlign: 'center', mt: 2, color: 'text.disabled' }}>
                    (Detected roles: {roles.join(', ') || 'None'})
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default DashboardPage;