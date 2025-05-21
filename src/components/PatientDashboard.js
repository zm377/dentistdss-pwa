import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Button, Avatar, Grid, Card, CardContent, CardActions } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import AuthContext for user info
import MessagePanel from './MessagePanel'; // Import MessagePanel

// Define navigation sections for the sidebar
const navigationSections = [
  { key: 'appointments', label: 'My Appointments', icon: <EventNoteIcon /> },
  { key: 'profile', label: 'My Profile', icon: <AccountCircleIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
  { key: 'dental-records', label: 'Dental Records', icon: <HealthAndSafetyIcon /> },
];

// Mock data - replace with API calls
const mockPatientProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-1234',
  address: '456 Health St, Wellness City, WC 67890',
  dateOfBirth: '1985-05-15',
  avatarUrl: '/static/images/avatar/1.jpg', // Placeholder
};

const mockAppointments = [
  { id: 'appt1', date: '2024-07-30', time: '10:00 AM', type: 'Check-up', dentist: 'Dr. Smith', clinic: 'Sunshine Dental Clinic', status: 'Confirmed' },
  { id: 'appt2', date: '2024-08-15', time: '02:00 PM', type: 'Cleaning', dentist: 'Dr. Grant', clinic: 'Bright Smiles Dental Care', status: 'Scheduled' },
];

const mockMessages = [
  { id: 'msg1', subject: 'Appointment Reminder', date: '2024-07-28', from: 'Sunshine Dental Clinic', read: false },
  { id: 'msg2', subject: 'Follow-up on your recent visit', date: '2024-07-10', from: 'Dr. Smith', read: true },
];

const PatientDashboard = ({ activeSection = 'appointments' }) => {
  const [patientProfile, setPatientProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    setLoading(true);
    setError('');

    // Build patient profile from authenticated user if available
    let profileFromAuth = null;
    if (currentUser) {
      profileFromAuth = {
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || currentUser.username || currentUser.email || 'User',
        email: currentUser.email,
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        avatarUrl: currentUser.avatarUrl || currentUser.photoURL || currentUser.profilePicture || '',
      };
    }

    // Simulate API calls or use mock data if not authenticated
    setTimeout(() => {
      setPatientProfile(profileFromAuth || mockPatientProfile);
      setAppointments(mockAppointments);
      setMessages(mockMessages);
      setLoading(false);
    }, 500);
  }, [currentUser]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!patientProfile) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Patient profile not found.</Alert>;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">My Appointments</Typography>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                  <Button 
                    component={RouterLink} 
                    to="/book-appointment" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{ px: 3, py: 1 }}
                  >
                    Book New Appointment
                  </Button>
                </Box>
                
                {appointments.length === 0 ? (
                  <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
                    You have no upcoming appointments.
                  </Typography>
                ) : (
                  <List sx={{ 
                    '& .MuiListItem-root': { 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 2
                    },
                    '& .MuiListItem-root:last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    {appointments.map((appt) => (
                      <ListItem key={appt.id}>
                        <ListItemText 
                          primary={
                            <Typography variant="h6" fontWeight="medium">
                              {`${appt.type} with ${appt.dentist}`}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body1">
                                <strong>Clinic:</strong> {appt.clinic}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Date:</strong> {appt.date} | <strong>Time:</strong> {appt.time}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Status:</strong> {appt.status}
                              </Typography>
                            </Box>
                          }
                          sx={{ mr: 2 }}
                        />
                        <Button 
                          size="medium" 
                          variant="outlined"
                          sx={{ minWidth: 120 }}
                        >
                          View Details
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'profile':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">My Profile</Typography>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3, pb: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      src={patientProfile.avatarUrl} 
                      sx={{ 
                        width: 160, 
                        height: 160, 
                        mb: 2,
                        border: '4px solid',
                        borderColor: 'primary.light'
                      }}
                    >
                      {!patientProfile.avatarUrl && <AccountCircleIcon sx={{ fontSize: 100 }} />}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Typography variant="h4" sx={{ mb: 2 }}>{patientProfile.name}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            <strong>Email:</strong> {patientProfile.email}
                          </Typography>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            <strong>Phone:</strong> {patientProfile.phone}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            <strong>Date of Birth:</strong> {patientProfile.dateOfBirth}
                          </Typography>
                          <Typography variant="body1" component="div" sx={{ mb: 2, fontSize: '1.1rem' }}>
                            <strong>Address:</strong> {patientProfile.address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ px: 3, pb: 3 }}>
                <Button size="large" variant="contained" color="primary">Edit Profile</Button>
              </CardActions>
            </Card>
          </Box>
        );
        
      case 'messages':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Messages</Typography>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <MessagePanel userId={currentUser?.uid || 'mockUserId'} />
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'dental-records':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">My Dental Records</Typography>
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 3 }}>
                  Your dental records, including treatment history, X-rays, and notes from your dentist, will be accessible here.
                </Typography>
                <Alert severity="info" sx={{ mt: 2, p: 2 }}>
                  <Typography variant="body1">
                    This feature is currently under development and will be available soon.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );
        
      default:
        return (
          <Alert severity="info">
            Please select a section from the sidebar.
          </Alert>
        );
    }
  };

  return (
    <Box sx={{ 
      pt: 2,
      height: '100%',
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        mb: 4
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, md: 0 } 
        }}>
          <Avatar 
            src={patientProfile.avatarUrl} 
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 3,
              border: '3px solid',
              borderColor: 'primary.light'
            }}
          >
            {!patientProfile.avatarUrl && <AccountCircleIcon sx={{ fontSize: 50 }} />}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              Welcome, {patientProfile.name}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Manage your dental health and appointments
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {renderContent()}
    </Box>
  );
};

// Expose navigationSections for the MultiRoleDashboardLayout
PatientDashboard.navigationSections = navigationSections;

export default PatientDashboard;