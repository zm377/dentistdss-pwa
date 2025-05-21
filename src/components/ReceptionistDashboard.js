import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button, TextField, Grid, Chip, Card, CardContent, InputAdornment } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import SearchIcon from '@mui/icons-material/Search';
import MessagePanel from './MessagePanel';
import { useAuth } from '../context/AuthContext';

// Define navigation sections for the sidebar
const navigationSections = [
  { key: 'appointments', label: 'Appointments', icon: <EventAvailableIcon /> },
  { key: 'patients', label: 'Patient Management', icon: <PeopleAltIcon /> },
  { key: 'communication', label: 'Communication Log', icon: <PhoneIcon /> },
  { key: 'messages', label: 'Messages', icon: <MessageIcon /> },
];

// Mock data - replace with API calls
const mockClinicInfo = {
  name: 'Sunshine Dental Clinic',
  todayDate: new Date().toLocaleDateString(),
};

const mockAppointments = [
  { id: 'appt1', patientName: 'John Doe', time: '10:00 AM', dentist: 'Dr. Smith', type: 'Check-up', status: 'Confirmed' },
  { id: 'appt2', patientName: 'Alice Brown', time: '11:30 AM', dentist: 'Dr. Smith', type: 'Filling', status: 'Confirmed' },
  { id: 'appt3', patientName: 'Bob Green', time: '02:00 PM', dentist: 'Dr. Grant', type: 'Consultation', status: 'Arrived' },
  { id: 'appt4', patientName: 'Carol White', time: '03:00 PM', dentist: 'Dr. Smith', type: 'Cleaning', status: 'Pending Confirmation' },
];

const mockPatients = [
  { id: 'patient1', name: 'John Doe', phone: '555-1234', lastVisit: '2024-01-15', nextAppointment: '2024-07-30 10:00 AM' },
  { id: 'patient2', name: 'Alice Brown', phone: '555-5678', lastVisit: '2024-03-22', nextAppointment: '2024-07-30 11:30 AM' },
];

const ReceptionistDashboard = ({ activeSection = 'appointments' }) => {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth() || {}; // Get currentUser

  // TODO: Get clinicId from AuthContext or props
  const clinicId = 'sunshinedental'; // Placeholder
  const receptionistId = currentUser?.uid || 'receptionistUser'; // Placeholder for receptionist ID

  useEffect(() => {
    setLoading(true);
    setError('');
    // Simulate API calls for a specific clinic
    setTimeout(() => {
      setClinicInfo(mockClinicInfo);
      setAppointments(mockAppointments); // Filter/fetch by clinicId
      setPatients(mockPatients); // Filter/fetch by clinicId
      setLoading(false);
    }, 1000);
  }, [clinicId]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredAppointments = appointments.filter(appt => 
    appt.patientName.toLowerCase().includes(searchTerm) || 
    appt.dentist.toLowerCase().includes(searchTerm)
  );

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Pending Confirmation': return 'warning';
      case 'Cancelled': return 'error';
      case 'Arrived': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!clinicInfo) {
    return <Alert severity="warning" sx={{ mt: 2 }}>Clinic information not available.</Alert>;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="medium">Today's Appointments</Typography>
              <Button variant="contained">Schedule New Appointment</Button>
            </Box>
            
            <TextField 
              fullWidth
              placeholder="Search appointments..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <Card>
              <CardContent>
                {filteredAppointments.length === 0 ? (
                  <Typography>No appointments matching your search or for today.</Typography>
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
                    {filteredAppointments.map((appt) => (
                      <ListItem key={appt.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 80 }}>
                            {appt.time}
                          </Typography>
                        </Box>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {appt.patientName} 
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2">
                                <strong>With:</strong> {appt.dentist} | <strong>Type:</strong> {appt.type}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={appt.status} 
                            color={getStatusColor(appt.status)} 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                          <Button size="small" variant="outlined">Manage</Button>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'patients':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="medium">Patient Management</Typography>
              <Button variant="contained">Register New Patient</Button>
            </Box>
            
            <TextField 
              fullWidth
              placeholder="Search patients by name or phone..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <Card>
              <CardContent>
                {filteredPatients.length === 0 ? (
                  <Typography>No patients matching your search.</Typography>
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
                    {filteredPatients.map((patient) => (
                      <ListItem key={patient.id} onClick={() => alert(`Viewing details for ${patient.name}`)}>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {patient.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2">
                                <strong>Phone:</strong> {patient.phone}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Last Visit:</strong> {patient.lastVisit} | <strong>Next Appt:</strong> {patient.nextAppointment || 'None'}
                              </Typography>
                            </Box>
                          }
                        />
                        <Button size="small" variant="outlined">View Profile</Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        );
        
      case 'communication':
        return (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="medium">Communication Log</Typography>
            <Card>
              <CardContent>
                <Alert severity="info">
                  This feature allows you to log calls, emails, and direct communications with patients. 
                  It's currently being developed and will be available soon.
                </Alert>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Planned Features
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Call Logging" 
                        secondary="Record incoming and outgoing calls with patients, including call details and action items"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Email Tracking" 
                        secondary="Track email communications sent to patients for appointment confirmations and reminders"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="SMS Notifications" 
                        secondary="Log and manage text message notifications sent to patients"
                      />
                    </ListItem>
                  </List>
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
                <MessagePanel userId={receptionistId} />
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          {clinicInfo.name} - Reception
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Today: {clinicInfo.todayDate}
        </Typography>
      </Box>
      
      {renderContent()}
    </Box>
  );
};

// Expose navigationSections for the MultiRoleDashboardLayout
ReceptionistDashboard.navigationSections = navigationSections;

export default ReceptionistDashboard;