import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, List, ListItem, ListItemText, Button, TextField, Grid, Chip } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message'; // Import MessageIcon
import MessagePanel from './MessagePanel'; // Import MessagePanel
import { useAuth } from '../context/AuthContext'; // Import useAuth

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`receptionist-tabpanel-${index}`}
      aria-labelledby={`receptionist-tab-${index}`}
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

const ReceptionistDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {clinicInfo.name} - Reception Desk
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Today: {clinicInfo.todayDate}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="Receptionist dashboard tabs">
          <Tab label="Appointments" icon={<EventAvailableIcon />} id="receptionist-tab-0" aria-controls="receptionist-tabpanel-0" />
          <Tab label="Patient Management" icon={<PeopleAltIcon />} id="receptionist-tab-1" aria-controls="receptionist-tabpanel-1" />
          <Tab label="Communication Log" icon={<PhoneIcon />} id="receptionist-tab-2" aria-controls="receptionist-tabpanel-2" />
          <Tab label="Messages" icon={<MessageIcon />} id="receptionist-tab-3" aria-controls="receptionist-tabpanel-3" /> {/* New Messages Tab */}
        </Tabs>
      </Box>

      <TextField 
        fullWidth
        label="Search Appointments / Patients..."
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Today's Appointments</Typography>
        <Button variant="contained" sx={{mb: 2}}>Schedule New Appointment</Button>
        {filteredAppointments.length === 0 ? (
          <Typography>No appointments matching your search or for today.</Typography>
        ) : (
          <List>
            {filteredAppointments.map((appt) => (
              <ListItem key={appt.id} divider>
                <ListItemText 
                  primary={`${appt.time} - ${appt.patientName} with ${appt.dentist}`}
                  secondary={`Type: ${appt.type}`}
                />
                <Chip label={appt.status} color={getStatusColor(appt.status)} size="small" />
                {/* Add buttons for check-in, reschedule, cancel */}
                <Button size="small" sx={{ml:1}}>Manage</Button>
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Patient Management</Typography>
        <Button variant="contained" sx={{mb: 2}}>Register New Patient</Button>
        {filteredPatients.length === 0 ? (
            <Typography>No patients matching your search.</Typography>
        ) : (
            <List>
                {filteredPatients.map((patient) => (
                <ListItem key={patient.id} divider button onClick={() => alert(`Viewing details for ${patient.name}`)}>
                    <ListItemText 
                    primary={patient.name}
                    secondary={`Phone: ${patient.phone} | Last Visit: ${patient.lastVisit} | Next Appt: ${patient.nextAppointment || 'None'}`}
                    />
                </ListItem>
                ))}
            </List>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Communication Log</Typography>
        <Typography>
          Log of calls, emails, and messages with patients. (Feature to be implemented)
        </Typography>
        {/* Placeholder for communication log components */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}> {/* New TabPanel for Messages */}
        <MessagePanel userId={receptionistId} />
      </TabPanel>
    </Paper>
  );
};

export default ReceptionistDashboard;