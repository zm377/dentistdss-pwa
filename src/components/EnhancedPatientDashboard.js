import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Event as EventIcon,
  MedicalServices as MedicalServicesIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AppointmentBooking from './AppointmentBooking';
import AppointmentCalendar from './AppointmentCalendar';
import EnhancedChatInterface from './EnhancedChatInterface';
import { useNotifications } from './NotificationSystem';

const EnhancedPatientDashboard = ({ activeSection = 'overview' }) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  // Mock patient data
  const mockPatientData = {
    id: 'patient-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    insurance: {
      provider: 'HealthCare Plus',
      policyNumber: 'HC123456789',
      groupNumber: 'GRP001'
    },
    medicalHistory: [
      'No known allergies',
      'Previous root canal (2020)',
      'Regular cleanings every 6 months'
    ],
    upcomingAppointments: 2,
    lastVisit: '2024-10-15',
    nextAppointment: '2024-12-20'
  };

  const mockAppointments = [
    {
      id: 1,
      date: new Date(2024, 11, 20, 14, 0),
      type: 'Regular Checkup',
      dentist: 'Dr. Smith',
      status: 'confirmed',
      duration: 60,
      notes: 'Routine examination and cleaning'
    },
    {
      id: 2,
      date: new Date(2024, 11, 27, 10, 30),
      type: 'Follow-up',
      dentist: 'Dr. Johnson',
      status: 'pending',
      duration: 30,
      notes: 'Check healing progress'
    }
  ];

  useEffect(() => {
    const loadPatientData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPatientData(mockPatientData);
        setAppointments(mockAppointments);
      } catch (error) {
        console.error('Error loading patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, []);

  const handleBookingComplete = (appointmentData) => {
    // Add new appointment to the list
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: 'pending'
    };
    setAppointments(prev => [...prev, newAppointment]);

    // Send notification
    addNotification({
      type: 'appointment',
      title: 'Appointment Booked',
      message: `Your appointment for ${appointmentData.service} has been scheduled.`,
      urgent: false
    });
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Welcome Card */}
      <Grid item xs={12}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mr: 2,
                  bgcolor: 'primary.main'
                }}
              >
                {patientData?.firstName?.[0]}{patientData?.lastName?.[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  Welcome back, {patientData?.firstName}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your next appointment is on {new Date(patientData?.nextAppointment).toLocaleDateString()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowBookingDialog(true)}
              >
                Book Appointment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h4" color="primary">
                  {patientData?.upcomingAppointments}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Appointments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon color="secondary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h4" color="secondary">
                  6
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Visits
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon color="success" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="body1" color="success.main">
                  {new Date(patientData?.lastVisit).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Visit
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalServicesIcon color="info" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="body1" color="info.main">
                  Excellent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Oral Health
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Appointments */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <List>
              {appointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {appointment.type}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={appointment.status === 'confirmed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {appointment.date.toLocaleDateString()} at {appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            with {appointment.dentist} • {appointment.duration} minutes
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < appointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            {appointments.length === 0 && (
              <Alert severity="info">
                No upcoming appointments. Book your next visit today!
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Health Reminders */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Health Reminders
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Cleaning Due"
                  secondary="Schedule your 6-month cleaning"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Insurance Update"
                  secondary="Verify your insurance information"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderProfile = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Personal Information</Typography>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography variant="body1">{patientData?.firstName} {patientData?.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1">{new Date(patientData?.dateOfBirth).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{patientData?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{patientData?.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography variant="body1">{patientData?.address}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
            <Typography variant="body1" gutterBottom>{patientData?.emergencyContact?.name}</Typography>

            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
            <Typography variant="body1" gutterBottom>{patientData?.emergencyContact?.phone}</Typography>

            <Typography variant="subtitle2" color="text.secondary">Relationship</Typography>
            <Typography variant="body1">{patientData?.emergencyContact?.relationship}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAppointments = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">My Appointments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowBookingDialog(true)}
        >
          Book New Appointment
        </Button>
      </Box>
      <AppointmentCalendar
        viewType="month"
        userRole="patient"
        onNewAppointment={() => setShowBookingDialog(true)}
      />
    </Box>
  );

  const renderChat = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Chat with AI Assistant
      </Typography>
      <EnhancedChatInterface
        chatType="help"
        placeholder="Ask about dental health, appointments, or clinic services..."
        welcomeMessage="Hello! I'm your dental AI assistant. I can help you with appointment booking, dental health questions, and clinic information. How can I assist you today?"
      />
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'appointments':
        return renderAppointments();
      case 'profile':
        return renderProfile();
      case 'messages':
        return renderChat();
      default:
        return renderOverview();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {renderContent()}

      <AppointmentBooking
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onBookingComplete={handleBookingComplete}
      />
    </Box>
  );
};

export default EnhancedPatientDashboard;
