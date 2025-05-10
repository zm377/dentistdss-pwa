import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, List, ListItem, ListItemText, Avatar, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import MessageIcon from '@mui/icons-material/Message'; // Import MessageIcon
import MessagePanel from './MessagePanel'; // Import MessagePanel
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Mock data - replace with API calls
const mockDentistProfile = {
  name: 'Dr. Jane Smith',
  specialty: 'General Dentistry, Cosmetic Dentistry',
  clinicName: 'Sunshine Dental Clinic',
  email: 'jane.smith@sunshinedental.com',
  phone: '555-0102',
  avatarUrl: '/static/images/avatar/2.jpg', // Placeholder
};

const mockAppointments = [
  { id: 'appt1', patientName: 'John Doe', time: '10:00 AM', date: '2024-07-30', type: 'Check-up', status: 'Confirmed' },
  { id: 'appt2', patientName: 'Alice Brown', time: '11:30 AM', date: '2024-07-30', type: 'Filling', status: 'Confirmed' },
  { id: 'appt3', patientName: 'Bob Green', time: '02:00 PM', date: '2024-07-30', type: 'Consultation', status: 'Pending' },
  { id: 'appt4', patientName: 'Carol White', time: '09:00 AM', date: '2024-07-31', type: 'Cleaning', status: 'Confirmed' },
];

const mockPatientRecords = [
  { id: 'patient1', name: 'John Doe', lastVisit: '2024-01-15', notes: 'Regular check-up, no issues.' },
  { id: 'patient2', name: 'Alice Brown', lastVisit: '2024-03-22', notes: 'Filling on tooth #14.' },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dentist-tabpanel-${index}`}
      aria-labelledby={`dentist-tab-${index}`}
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

const DentistDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dentistProfile, setDentistProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth() || {}; // Get currentUser

  // TODO: Get dentistId from AuthContext or props
  const dentistId = currentUser?.uid || 'dentistJane'; // Placeholder, use actual ID

  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API calls for a specific dentist
    setTimeout(() => {
      setDentistProfile(mockDentistProfile); // Assuming dentistId is used to fetch these
      setAppointments(mockAppointments); // Filter/fetch by dentistId
      setPatientRecords(mockPatientRecords); // Filter/fetch by dentistId
      setLoading(false);
    }, 1000);
  }, [dentistId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!dentistProfile) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Dentist profile not found.</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={dentistProfile.avatarUrl} sx={{ width: 56, height: 56, mr: 2 }}>
            {!dentistProfile.avatarUrl && <PersonIcon />}
        </Avatar>
        <div>
            <Typography variant="h4" component="h1">
                {dentistProfile.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                {dentistProfile.specialty} - {dentistProfile.clinicName}
            </Typography>
        </div>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Dentist dashboard tabs">
          <Tab label="Appointments" icon={<EventIcon />} id="dentist-tab-0" aria-controls="dentist-tabpanel-0" />
          <Tab label="Patient Records" icon={<NotesIcon />} id="dentist-tab-1" aria-controls="dentist-tabpanel-1" />
          <Tab label="Profile" icon={<PersonIcon />} id="dentist-tab-2" aria-controls="dentist-tabpanel-2" />
          <Tab label="Messages" icon={<MessageIcon />} id="dentist-tab-3" aria-controls="dentist-tabpanel-3" /> {/* New Messages Tab */}
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Today's & Upcoming Appointments</Typography>
        {appointments.length === 0 ? (
          <Typography>No upcoming appointments.</Typography>
        ) : (
          <List>
            {appointments.map((appt) => (
              <ListItem key={appt.id} divider>
                <ListItemText 
                  primary={`${appt.patientName} - ${appt.type}`}
                  secondary={`${appt.date} at ${appt.time}`}
                />
                <Chip label={appt.status} color={appt.status === 'Confirmed' ? 'success' : 'warning'} size="small" />
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Patient Records</Typography>
        {/* Add search/filter for patients */} 
        {patientRecords.length === 0 ? (
            <Typography>No patient records found.</Typography>
        ) : (
            <List>
                {patientRecords.map((patient) => (
                <ListItem key={patient.id} divider button onClick={() => alert(`Viewing record for ${patient.name}`)}>
                    <ListItemText 
                    primary={patient.name}
                    secondary={`Last Visit: ${patient.lastVisit} - Notes: ${patient.notes.substring(0,50)}...`}
                    />
                </ListItem>
                ))}
            </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>My Profile</Typography>
        <Typography><strong>Name:</strong> {dentistProfile.name}</Typography>
        <Typography><strong>Email:</strong> {dentistProfile.email}</Typography>
        <Typography><strong>Phone:</strong> {dentistProfile.phone}</Typography>
        <Typography><strong>Specialty:</strong> {dentistProfile.specialty}</Typography>
        <Typography><strong>Clinic:</strong> {dentistProfile.clinicName}</Typography>
        {/* Add button to edit profile */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}> {/* New TabPanel for Messages */}
        <MessagePanel userId={dentistId} />
      </TabPanel>
    </Paper>
  );
};

export default DentistDashboard;