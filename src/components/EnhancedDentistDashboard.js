import React, {useState, useEffect} from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  Notes as NotesIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {useAuth} from '../context/AuthContext';
import AppointmentCalendar from './AppointmentCalendar';
import ClinicalNotesEditor from './ClinicalNotesEditor';
import EnhancedDataGrid from './EnhancedDataGrid';
import EnhancedChatInterface from './EnhancedChatInterface';
import {useNotifications} from './NotificationSystem';

const EnhancedDentistDashboard = ({activeSection = 'agenda'}) => {
  const {currentUser} = useAuth();
  const {addNotification} = useNotifications();
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNotesEditor, setShowNotesEditor] = useState(false);
  const [showPatientDrawer, setShowPatientDrawer] = useState(false);

  // Mock data
  const mockTodayAppointments = [
    {
      id: 1,
      time: '09:00',
      patient: 'John Doe',
      type: 'Checkup',
      status: 'confirmed',
      duration: 60,
      urgency: 'normal',
      notes: 'Regular checkup, no issues reported'
    },
    {
      id: 2,
      time: '10:30',
      patient: 'Jane Smith',
      type: 'Root Canal',
      status: 'in-progress',
      duration: 90,
      urgency: 'high',
      notes: 'Follow-up root canal treatment'
    },
    {
      id: 3,
      time: '14:00',
      patient: 'Mike Johnson',
      type: 'Cleaning',
      status: 'pending',
      duration: 45,
      urgency: 'normal',
      notes: 'Routine dental cleaning'
    },
    {
      id: 4,
      time: '15:30',
      patient: 'Sarah Wilson',
      type: 'Consultation',
      status: 'confirmed',
      duration: 30,
      urgency: 'urgent',
      notes: 'Emergency consultation for tooth pain'
    }
  ];

  const patientRecordsColumns = [
    {field: 'name', headerName: 'Patient Name', width: 200},
    {field: 'lastVisit', headerName: 'Last Visit', type: 'date', width: 120},
    {field: 'nextAppointment', headerName: 'Next Appointment', type: 'date', width: 150},
    {field: 'treatmentPlan', headerName: 'Treatment Plan', width: 200},
    {
      field: 'status',
      headerName: 'Status',
      type: 'chip',
      width: 120,
      getColor: (value) => {
        switch (value) {
          case 'active':
            return 'success';
          case 'pending':
            return 'warning';
          case 'completed':
            return 'info';
          default:
            return 'default';
        }
      }
    }
  ];

  const mockPatientRecords = [
    {
      id: 1,
      name: 'John Doe',
      lastVisit: '2024-11-15',
      nextAppointment: '2024-12-15',
      treatmentPlan: 'Regular maintenance',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastVisit: '2024-11-10',
      nextAppointment: '2024-12-10',
      treatmentPlan: 'Root canal completion',
      status: 'pending'
    }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTodayAppointments(mockTodayAppointments);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'normal':
        return 'success';
      default:
        return 'default';
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDrawer(true);
  };

  const renderTodayAgenda = () => (
      <Grid container spacing={3}>
        {/* Today's Overview */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Today's Schedule - {new Date().toLocaleDateString()}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{textAlign: 'center'}}>
                    <Typography variant="h3" color="primary">
                      {todayAppointments.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Appointments
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{textAlign: 'center'}}>
                    <Typography variant="h3" color="success.main">
                      {todayAppointments.filter(apt => apt.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{textAlign: 'center'}}>
                    <Typography variant="h3" color="warning.main">
                      {todayAppointments.filter(apt => apt.urgency === 'urgent').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Urgent Cases
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{textAlign: 'center'}}>
                    <Typography variant="h3" color="info.main">
                      {todayAppointments.reduce((total, apt) => total + apt.duration, 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Minutes
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Appointment List */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Appointments
              </Typography>
              <List>
                {todayAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: appointment.status === 'in-progress' ? 'action.hover' : 'transparent'
                          }}
                      >
                        <ListItemIcon>
                          <Box sx={{textAlign: 'center', minWidth: 60}}>
                            <Typography variant="h6" color="primary">
                              {appointment.time}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.duration}min
                            </Typography>
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                            primary={
                              <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {appointment.patient}
                                </Typography>
                                <Chip
                                    label={appointment.type}
                                    size="small"
                                    variant="outlined"
                                />
                                <Chip
                                    label={appointment.status}
                                    size="small"
                                    color={getStatusColor(appointment.status)}
                                />
                                {appointment.urgency !== 'normal' && (
                                    <Chip
                                        label={appointment.urgency}
                                        size="small"
                                        color={getUrgencyColor(appointment.urgency)}
                                    />
                                )}
                              </Box>
                            }
                            secondary={appointment.notes}
                        />
                        <Box sx={{display: 'flex', gap: 1}}>
                          <Tooltip title="View patient details">
                            <IconButton
                                size="small"
                                onClick={() => handlePatientClick(appointment)}
                            >
                              <PersonIcon/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add clinical notes">
                            <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedPatient(appointment);
                                  setShowNotesEditor(true);
                                }}
                            >
                              <NotesIcon/>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit appointment">
                            <IconButton size="small">
                              <EditIcon/>
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                    </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                <Button
                    variant="outlined"
                    startIcon={<AddIcon/>}
                    fullWidth
                >
                  Add Emergency Appointment
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<NotesIcon/>}
                    fullWidth
                    onClick={() => setShowNotesEditor(true)}
                >
                  Create Clinical Note
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<AssignmentIcon/>}
                    fullWidth
                >
                  View Treatment Plans
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<TrendingUpIcon/>}
                    fullWidth
                >
                  Patient Analytics
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Urgent Alerts */}
          <Card sx={{mt: 2}}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.main">
                <WarningIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                Urgent Alerts
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="error"/>
                  </ListItemIcon>
                  <ListItemText
                      primary="Lab results pending"
                      secondary="Patient: Sarah Wilson"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="warning"/>
                  </ListItemIcon>
                  <ListItemText
                      primary="Follow-up overdue"
                      secondary="Patient: Mike Johnson"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  );

  const renderPatientRecords = () => (
      <Box>
        <Typography variant="h5" gutterBottom>
          Patient Records
        </Typography>
        <EnhancedDataGrid
            data={mockPatientRecords}
            columns={patientRecordsColumns}
            title="All Patients"
            onRowClick={handlePatientClick}
            onEdit={(patient) => console.log('Edit patient:', patient)}
            onAdd={() => console.log('Add new patient')}
            searchable
            sortable
            filterable
            exportable
        />
      </Box>
  );

  const renderCalendar = () => (
      <Box>
        <Typography variant="h5" gutterBottom>
          Appointment Calendar
        </Typography>
        <AppointmentCalendar
            viewType="month"
            userRole="dentist"
            onNewAppointment={() => console.log('New appointment')}
        />
      </Box>
  );

  const renderAIAssistant = () => (
      <Box>
        <Typography variant="h5" gutterBottom>
          AI Clinical Assistant
        </Typography>
        <EnhancedChatInterface
            chatType="aidentist"
            placeholder="Ask about patient symptoms, treatment options, or clinical guidelines..."
            welcomeMessage="Hello Dr. I'm your AI clinical assistant. I can help with patient assessments, treatment planning, and clinical decision support. How can I assist you today?"
        />
      </Box>
  );

  if (loading) {
    return (
        <Box sx={{width: '100%', mt: 2}}>
          <LinearProgress/>
          <Typography variant="body2" sx={{mt: 1, textAlign: 'center'}}>
            Loading your dashboard...
          </Typography>
        </Box>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'agenda':
        return renderTodayAgenda();
      case 'appointments':
        return renderCalendar();
      case 'patient-records':
        return renderPatientRecords();
      case 'ai-assistant':
        return renderAIAssistant();
      default:
        return renderTodayAgenda();
    }
  };

  return (
      <Box sx={{p: 3}}>
        {renderContent()}

        {/* Clinical Notes Editor Dialog */}
        <Dialog
            open={showNotesEditor}
            onClose={() => setShowNotesEditor(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{sx: {height: '80vh'}}}
        >
          <DialogTitle>
            Clinical Notes
            {selectedPatient && ` - ${selectedPatient.patient || selectedPatient.name}`}
          </DialogTitle>
          <DialogContent>
            <ClinicalNotesEditor
                patientId={selectedPatient?.id}
                appointmentId={selectedPatient?.id}
                onSave={(noteData) => {
                  console.log('Saving note:', noteData);
                  addNotification({
                    type: 'success',
                    title: 'Note Saved',
                    message: 'Clinical note has been saved successfully.',
                  });
                }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowNotesEditor(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Patient Details Drawer */}
        <Drawer
            anchor="right"
            open={showPatientDrawer}
            onClose={() => setShowPatientDrawer(false)}
            PaperProps={{sx: {width: {xs: '100%', sm: 400}}}}
        >
          <Box sx={{p: 3}}>
            <Typography variant="h6" gutterBottom>
              Patient Details
            </Typography>
            {selectedPatient && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    {selectedPatient.patient || selectedPatient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedPatient.notes}
                  </Typography>
                  <Button
                      variant="contained"
                      startIcon={<NotesIcon/>}
                      onClick={() => {
                        setShowPatientDrawer(false);
                        setShowNotesEditor(true);
                      }}
                  >
                    Add Clinical Note
                  </Button>
                </Box>
            )}
          </Box>
        </Drawer>
      </Box>
  );
};

export default EnhancedDentistDashboard;
