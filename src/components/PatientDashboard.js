import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, List, ListItem, ListItemText, Button, Avatar, Grid, Card, CardContent, CardActions } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import AuthContext for user info
import MessagePanel from './MessagePanel'; // Import MessagePanel

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PatientDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patientProfile, setPatientProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API calls for the logged-in patient
    // const patientId = currentUser?.uid; // Or however patient ID is stored
    setTimeout(() => {
      setPatientProfile(mockPatientProfile);
      setAppointments(mockAppointments);
      // setMessages(mockMessages); // MessagePanel will fetch its own messages
      setLoading(false);
    }, 1000);
  }, []); // Add currentUser to dependency array if used

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!patientProfile) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Patient profile not found.</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Avatar src={patientProfile.avatarUrl} sx={{ width: 64, height: 64 }}>
            {!patientProfile.avatarUrl && <AccountCircleIcon sx={{ fontSize: 64}} />}
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1">
            Welcome, {patientProfile.name}!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage your dental health and appointments.
          </Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Patient dashboard tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="My Appointments" icon={<EventNoteIcon />} id="patient-tab-0" aria-controls="patient-tabpanel-0" />
          <Tab label="My Profile" icon={<AccountCircleIcon />} id="patient-tab-1" aria-controls="patient-tabpanel-1" />
          <Tab label="Messages" icon={<MessageIcon />} id="patient-tab-2" aria-controls="patient-tabpanel-2" badgeContent={messages.filter(m => !m.read).length} color="error" />
          <Tab label="Dental Records" icon={<HealthAndSafetyIcon />} id="patient-tab-3" aria-controls="patient-tabpanel-3" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>My Appointments</Typography>
        <Button component={RouterLink} to="/book-appointment" variant="contained" color="primary" sx={{ mb: 2 }}>
          Book New Appointment
        </Button>
        {appointments.length === 0 ? (
          <Typography>You have no upcoming appointments.</Typography>
        ) : (
          <List>
            {appointments.map((appt) => (
              <ListItem key={appt.id} divider>
                <ListItemText 
                  primary={`${appt.type} with ${appt.dentist} at ${appt.clinic}`}
                  secondary={`Date: ${appt.date}, Time: ${appt.time} - Status: ${appt.status}`}
                />
                <Button size="small" variant="outlined">View Details</Button>
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>My Profile</Typography>
        <Card>
            <CardContent>
                <Typography><strong>Name:</strong> {patientProfile.name}</Typography>
                <Typography><strong>Email:</strong> {patientProfile.email}</Typography>
                <Typography><strong>Phone:</strong> {patientProfile.phone}</Typography>
                <Typography><strong>Address:</strong> {patientProfile.address}</Typography>
                <Typography><strong>Date of Birth:</strong> {patientProfile.dateOfBirth}</Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">Edit Profile</Button>
            </CardActions>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Messages</Typography>
        {messages.length === 0 ? (
          <Typography>You have no messages.</Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <ListItem key={msg.id} divider sx={{ bgcolor: !msg.read ? 'action.hover' : 'transparent' }}>
                <ListItemText 
                  primary={msg.subject}
                  secondary={`From: ${msg.from} - Date: ${msg.date}`}
                />
                <Button size="small">{msg.read ? 'View' : 'Mark as Read & View'}</Button>
              </ListItem>
            ))}
          </List>
        )}
        <MessagePanel userId={currentUser?.uid || 'mockUserId'} /> {/* Pass userId to MessagePanel */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>My Dental Records</Typography>
        <Typography>
          Your dental records, including treatment history, X-rays, and notes from your dentist, will be accessible here. (Feature to be implemented)
        </Typography>
        {/* Placeholder for dental records display */}
      </TabPanel>
    </Paper>
  );
};

export default PatientDashboard;