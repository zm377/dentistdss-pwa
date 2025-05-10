import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box, Typography, useMediaQuery } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import { useAuth } from './context/AuthContext'; // Import useAuth
import config from './config';
import './App.css';

// Import new components
import ClinicStaffSignup from './components/ClinicStaffSignup';
import SystemAdminDashboard from './components/SystemAdminDashboard';
import ClinicAdminDashboard from './components/ClinicAdminDashboard';
import DentistDashboard from './components/DentistDashboard';
import ReceptionistDashboard from './components/ReceptionistDashboard';
import PatientDashboard from './components/PatientDashboard';
// Assuming MessagePanel might be part of other components or layouts, not a direct route for now

// Remove placeholder components as they are now imported
// const Login = () => <Typography variant="h4">Login Page Placeholder</Typography>;
// const Signup = () => <Typography variant="h4">Signup Page Placeholder</Typography>;

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, loading, currentUser } = useAuth(); // Use authentication state from context
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [initialThemeSet, setInitialThemeSet] = useState(false);

  // Set initial theme based on user's system preference
  React.useEffect(() => {
    if (!initialThemeSet) {
      setDarkMode(prefersDarkMode);
      setInitialThemeSet(true);
    }
  }, [prefersDarkMode, initialThemeSet]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#013427',
        },
        secondary: {
          main: '#014d40',
        },
        background: {
          default: darkMode ? '#121212' : '#f5f5f5',
          paper: darkMode ? '#312635' : '#ffffff',
        },
        marginTop: {
          xs: '64px', // Adjusted for mobile
          sm: '72px', // Adjusted for tablet
          md: '80px', // Adjusted for desktop
        }
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    }), [darkMode]);

  // Show loading indicator or null while checking auth status
  if (loading) {
    return null; // Or a loading spinner component
  }

  // User role for routing
  // const userRole = currentUser?.role || 'patient'; // Example: 'patient', 'system_admin', 'clinic_admin', 'dentist', 'receptionist'
  // For now, let's assume a way to get the role. This will be refined when AuthContext is updated.
  // To demonstrate different dashboards, we'll need a way to simulate roles or fetch it.
  // For this step, we'll add routes and protect them. The redirection logic will be basic.

  const getDashboardComponent = (role) => {
    switch (role) {
      case 'system_admin':
        return <SystemAdminDashboard />;
      case 'clinic_admin':
        return <ClinicAdminDashboard />;
      case 'dentist':
        return <DentistDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'patient':
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* Pass isAuthenticated and logout to Header */}
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Container
            maxWidth="md"
            sx={theme => ({
              flexGrow: 1,
              // py: { xs: 2, sm: 3, md: 4 }, // Original padding
              paddingTop: {
                xs: `calc(56px + ${theme.spacing(1)} + ${theme.spacing(2)})`, // Mobile header (56px + 2*spacing(0.5)) + original pt
                sm: `calc(64px + ${theme.spacing(2)} + ${theme.spacing(3)})`, // Desktop header (64px + 2*spacing(1)) + original pt
                md: `calc(64px + ${theme.spacing(2)} + ${theme.spacing(4)})`  // Desktop header (64px + 2*spacing(1)) + original pt
              },
              paddingBottom: {
                xs: theme.spacing(2),
                sm: theme.spacing(3),
                md: theme.spacing(4)
              },
              px: { xs: 1, sm: 2, md: 3 }
            })}
          >
            <Routes>
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/signup"
                element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />}
              />
              <Route 
                path="/clinic-staff-signup"
                element={!isAuthenticated ? <ClinicStaffSignup /> : <Navigate to="/dashboard" replace />}
              />
              {/* Welcome page - accessible to all users */}
              <Route
                path="/"
                element={<Welcome />}
              />
              {/* Chat interface - requires authentication */}
              <Route
                path="/chat"
                element={
                  isAuthenticated ? (
                    <>
                      <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                          mb: { xs: 2, sm: 3, md: 4 },
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                        }}
                      >
                        {config.app.name} - Your Dental Assistant
                      </Typography>
                      <ChatInterface apiKeyProp={config.chatbot.apiKey} />
                    </>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              {/* Role-based dashboards - requires authentication */}
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    // This logic will be more complex once AuthContext provides the role
                    // For now, let's assume a patient dashboard or a redirect based on a fetched role
                    currentUser && currentUser.role && currentUser.approvalStatus === 'approved' ? 
                      getDashboardComponent(currentUser.role) : 
                      (currentUser && currentUser.approvalStatus === 'pending' ? 
                        <Navigate to="/pending-approval" replace /> : // Or a generic page indicating pending status
                        <Navigate to="/login" replace />
                      )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
               <Route
                path="/system-admin-dashboard"
                element={isAuthenticated && currentUser?.role === 'system_admin' && currentUser?.approvalStatus === 'approved' ? <SystemAdminDashboard /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/clinic-admin-dashboard"
                element={isAuthenticated && currentUser?.role === 'clinic_admin' && currentUser?.approvalStatus === 'approved' ? <ClinicAdminDashboard /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/dentist-dashboard"
                element={isAuthenticated && currentUser?.role === 'dentist' && currentUser?.approvalStatus === 'approved' ? <DentistDashboard /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/receptionist-dashboard"
                element={isAuthenticated && currentUser?.role === 'receptionist' && currentUser?.approvalStatus === 'approved' ? <ReceptionistDashboard /> : <Navigate to="/dashboard" replace />}
              />
              <Route
                path="/patient-dashboard"
                element={isAuthenticated && currentUser?.role === 'patient' && currentUser?.approvalStatus === 'approved' ? <PatientDashboard /> : <Navigate to="/dashboard" replace />}
              />
              {/* Add a route for pending approval page if needed */}
              <Route 
                path="/pending-approval"
                element={<Typography variant="h5" align="center" sx={{mt: 4}}>Your account is pending approval. Please check your email or contact support.</Typography>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
          <Box
            component="footer"
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(38, 50, 56, 0.9)' : 'background.paper',
              textAlign: 'center',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(0, 230, 180, 0.1)' : 'none',
              borderBottomWidth: 0
            }}
          >
            <Typography
              variant="body2"
              sx={{ 
                fontSize: 'inherit',
                color: theme => theme.palette.mode === 'dark' ? '#e0f2f1' : 'text.secondary',
                '& a': {
                  color: theme => theme.palette.mode === 'dark' ? '#81c784' : 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              © {new Date().getFullYear()} {config.app.name} by Zhifei Mi - All rights reserved.
              Contact us at: <a href="mailto:dentistdss@gmail.com">dentistdss@gmail.com</a>
              {/* For Academic Research purposes only. Not a substitute for professional dental advice. */}
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
