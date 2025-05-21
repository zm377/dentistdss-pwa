import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Avatar, Chip, Card, CardContent } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import NotesIcon from '@mui/icons-material/Notes';
import MessageIcon from '@mui/icons-material/Message';
import MessagePanel from './MessagePanel';
import { useAuth } from '../context/AuthContext';

// Define navigation sections for the sidebar
const navigationSections = [
  { key: 'appointments', label: 'Appointments', icon: <EventIcon /> },
  { key: 'patient-records', label: 'Patient Records', icon: <NotesIcon /> },
  { key: 'profile', label: 'My Profile', icon: <PersonIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

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

const DentistDashboard = ({ activeSection = 'appointments' }) => {
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

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!dentistProfile) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Dentist profile not found.</Alert>;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Today's & Upcoming Appointments</Typography>
            <Card>
              <CardContent>
                {appointments.length === 0 ? (
                  <Typography>No upcoming appointments.</Typography>
                ) : (
                  <List sx={{ 
                    '& .MuiListItem-root': { 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5
                    },
                    '& .MuiListItem-root:last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    {appointments.map((appt) => (
                      <ListItem key={appt.id}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {`${appt.patientName} - ${appt.type}`}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2">
                                <strong>Date:</strong> {appt.date} | <strong>Time:</strong> {appt.time}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip 
                          label={appt.status} 
                          color={appt.status === 'Confirmed' ? 'success' : 'warning'} 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'patient-records':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Patient Records</Typography>
            <Card>
              <CardContent>
                {patientRecords.length === 0 ? (
                  <Typography>No patient records found.</Typography>
                ) : (
                  <List sx={{ 
                    '& .MuiListItem-root': { 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    },
                    '& .MuiListItem-root:last-child': {
                      borderBottom: 'none'
                    }
                  }}>
                    {patientRecords.map((patient) => (
                      <ListItem key={patient.id} onClick={() => alert(`Viewing record for ${patient.name}`)}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {patient.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2">
                                <strong>Last Visit:</strong> {patient.lastVisit}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Notes:</strong> {patient.notes}
                              </Typography>
                            </Box>
                          }
                        />
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
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, mb: 3 }}>
                  <Avatar src={dentistProfile.avatarUrl} sx={{ width: 100, height: 100, mr: { sm: 3 }, mb: { xs: 2, sm: 0 } }}>
                    {!dentistProfile.avatarUrl && <PersonIcon sx={{ fontSize: 60 }} />}
                  </Avatar>
                  <Box>
                    <Typography variant="h5">{dentistProfile.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {dentistProfile.specialty}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1.5 }}>
                    <strong>Email:</strong> {dentistProfile.email}
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1.5 }}>
                    <strong>Phone:</strong> {dentistProfile.phone}
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1.5 }}>
                    <strong>Clinic:</strong> {dentistProfile.clinicName}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'messages':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Messages</Typography>
            <Card>
              <CardContent>
                <MessagePanel userId={dentistId} />
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar src={dentistProfile.avatarUrl} sx={{ width: 64, height: 64, mr: 2 }}>
          {!dentistProfile.avatarUrl && <PersonIcon sx={{ fontSize: 42 }} />}
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1">
            {dentistProfile.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {dentistProfile.specialty} - {dentistProfile.clinicName}
          </Typography>
        </Box>
      </Box>
      
      {renderContent()}
    </Box>
  );
};

// Expose navigationSections for the MultiRoleDashboardLayout
DentistDashboard.navigationSections = navigationSections;

export default DentistDashboard;