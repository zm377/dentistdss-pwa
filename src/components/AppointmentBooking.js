import React, {useState, useEffect} from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Chip,
  Alert,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/auth';
import api from '../../services';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AppointmentBooking = ({open, onClose, onBookingComplete}) => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'info'});

  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const steps = ['Select Service', 'Choose Dentist', 'Pick Date & Time', 'Confirm Details'];

  // Fetch services and dentists on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch services
        // Assuming an API endpoint like api.clinic.getServices() exists
        const fetchedServices = await api.clinic.getServices(); 
        setServices(fetchedServices.data || []); // Adjust based on actual API response

        // Fetch dentists
        // Assuming an API endpoint like api.clinic.getDentists() exists
        const fetchedDentists = await api.clinic.getDentists(currentUser.clinicId); // Pass clinicId if required
        setDentists(fetchedDentists.data || []); // Adjust based on actual API response

      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setSnackbar({
          open: true,
          message: 'Failed to load services or dentists. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.clinicId) {
      fetchInitialData();
    }
  }, [currentUser?.clinicId]);

  // Fetch available slots when selectedDate, selectedDentist, or selectedService changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDentist || !selectedService || !selectedDate || !currentUser?.clinicId) {
        setAvailableSlots([]);
        return;
      }

      setLoading(true);
      try {
        const serviceDuration = services.find(s => s.id === selectedService)?.duration;
        if (!serviceDuration) {
          console.warn('Service duration not found for selected service.');
          setAvailableSlots([]);
          setLoading(false);
          return;
        }

        const dateString = selectedDate.toISOString().split('T')[0];
        const slots = await api.appointment.getAvailableSlots(
          selectedDentist, // This needs to be the dentist's ID, not the mock 'dr-smith'
          currentUser.clinicId,
          dateString,
          serviceDuration
        );
        setAvailableSlots(slots || []); // Adjust based on actual API response
      } catch (err) {
        console.error('Failed to fetch available slots:', err);
        setSnackbar({
          open: true,
          message: 'Failed to load available slots. Please try again.',
          severity: 'error'
        });
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, selectedDentist, selectedService, services, currentUser?.clinicId]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleBookAppointment();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    try {
      const appointmentData = {
        patientId: currentUser.id, // Assuming the current user is the patient booking
        dentistId: selectedDentist, 
        clinicId: currentUser.clinicId,
        createdBy: currentUser.id,
        serviceId: selectedService,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        startTime: selectedTime,
        endTime: '', // This will need to be calculated based on start time and service duration
        reasonForVisit: patientNotes,
        symptoms: '',
        urgencyLevel: 'low',
        notes: patientNotes,
      };

      // Calculate endTime
      const serviceObj = services.find(s => s.id === selectedService);
      if (serviceObj && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startTimeDate = new Date(selectedDate);
        startTimeDate.setHours(hours, minutes, 0, 0);

        const endTimeDate = new Date(startTimeDate.getTime() + serviceObj.duration * 60 * 1000);
        appointmentData.endTime = endTimeDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }

      const newAppointment = await api.appointment.createAppointment(appointmentData);

      setSnackbar({
        open: true,
        message: 'Appointment booked successfully! You will receive a confirmation email shortly.',
        severity: 'success'
      });

      if (onBookingComplete) {
        onBookingComplete(newAppointment);
      }

      // Reset form
      setActiveStep(0);
      setSelectedService('');
      setSelectedDentist('');
      setSelectedTime(null);
      setPatientNotes('');

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Failed to book appointment:', error);
      setSnackbar({
        open: true,
        message: `Failed to book appointment: ${error.message || 'Please try again.'} `,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return selectedService !== '';
      case 1:
        return selectedDentist !== '';
      case 2:
        return selectedTime !== null;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>Select a Service</Typography>
              {loading && activeStep === 0 ? (
                <CircularProgress />
              ) : services.length === 0 ? (
                <Alert severity="info">No services available. Please check back later.</Alert>
              ) : (
                <Grid container spacing={2}>
                  {services.map((service) => (
                      <Grid item xs={12} sm={6} key={service.id}>
                        <Card
                            sx={{
                              cursor: 'pointer',
                              border: selectedService === service.id ? 2 : 1,
                              borderColor: selectedService === service.id ? 'primary.main' : 'divider',
                            }}
                            onClick={() => setSelectedService(service.id)}
                        >
                          <CardContent>
                            <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                              <MedicalServicesIcon sx={{mr: 1}}/>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {service.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Duration: {service.duration} minutes
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${service.price}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                  ))}
                </Grid>
              )}
            </Box>
        );

      case 1:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>Choose Your Dentist</Typography>
              {loading && activeStep === 1 ? (
                <CircularProgress />
              ) : dentists.length === 0 ? (
                <Alert severity="info">No dentists available. Please check back later.</Alert>
              ) : (
                <RadioGroup
                    value={selectedDentist}
                    onChange={(e) => setSelectedDentist(e.target.value)}
                >
                  {dentists.map((dentist) => (
                      <Card key={dentist.id} sx={{mb: 2, opacity: dentist.available ? 1 : 0.6}}>
                        <CardContent>
                          <FormControlLabel
                              value={dentist.id}
                              control={<Radio/>}
                              disabled={!dentist.available}
                              label={
                                <Box sx={{ml: 1}}>
                                  <Box sx={{display: 'flex', alignItems: 'center', mb: 0.5}}>
                                    <PersonIcon sx={{mr: 1}}/>
                                    <Typography variant="subtitle1" fontWeight="medium">
                                      {dentist.name}
                                    </Typography>
                                    {!dentist.available && (
                                        <Chip label="Unavailable" size="small" color="error" sx={{ml: 1}}/>
                                    )}
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {dentist.specialty}
                                  </Typography>
                                </Box>
                              }
                          />
                        </CardContent>
                      </Card>
                  ))}
                </RadioGroup>
              )}
            </Box>
        );

      case 2:
        return (
            <Box>
              <Typography variant="h6" gutterBottom>Select Date & Time</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Available Dates</Typography>
                  {/* Placeholder for DateCalendar - will be enabled when MUI X is installed */}
                  <Card sx={{p: 2, textAlign: 'center'}}>
                    <EventIcon sx={{fontSize: 48, color: 'text.secondary', mb: 1}}/>
                    <Typography variant="body2" color="text.secondary">
                      Calendar component will be available after installing @mui/x-date-pickers
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Available Times</Typography>
                  {loading && activeStep === 2 ? (
                    <CircularProgress />
                  ) : availableSlots.length === 0 ? (
                    <Alert severity="info">No available slots for the selected dentist and service on this date.</Alert>
                  ) : (
                    <Grid container spacing={1}>
                      {availableSlots.map((slot) => (
                          <Grid item xs={6} sm={4} key={slot}>
                            <Button
                                variant={selectedTime === slot ? 'contained' : 'outlined'}
                                fullWidth
                                size="small"
                                onClick={() => setSelectedTime(slot)}
                                startIcon={<ScheduleIcon/>}
                            >
                              {slot}
                            </Button>
                          </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
        );

      case 3:
        const selectedServiceObj = services.find(s => s.id === selectedService);
        const selectedDentistObj = dentists.find(d => d.id === selectedDentist);

        return (
            <Box>
              <Typography variant="h6" gutterBottom>Confirm Your Appointment</Typography>
              <List>
                <ListItem><Typography variant="subtitle1">Service:</Typography> <Typography>{selectedServiceObj?.name}</Typography></ListItem>
                <ListItem><Typography variant="subtitle1">Dentist:</Typography> <Typography>{selectedDentistObj?.name}</Typography></ListItem>
                <ListItem><Typography variant="subtitle1">Date:</Typography> <Typography>{selectedDate.toLocaleDateString()}</Typography></ListItem>
                <ListItem><Typography variant="subtitle1">Time:</Typography> <Typography>{selectedTime}</Typography></ListItem>
                <ListItem><Typography variant="subtitle1">Notes:</Typography> <Typography>{patientNotes || 'N/A'}</Typography></ListItem>
              </List>
              <FormControl fullWidth margin="normal">
                <TextField
                    label="Additional Notes (Optional)"
                    multiline
                    rows={3}
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    variant="outlined"
                />
              </FormControl>
            </Box>
        );

      default:
        return null;
    }
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Book New Appointment</DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} alternativeLabel sx={{mb: 3}}>
            {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
            ))}
          </Stepper>
          {renderStepContent()}
        </DialogContent>
        <DialogActions sx={{p: 2}}>
          <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
          >
            Back
          </Button>
          <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading || !isStepValid()}
          >
            {activeStep === steps.length - 1 ? 'Book Appointment' : 'Next'}
          </Button>
        </DialogActions>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({...snackbar, open: false})}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        >
          <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{width: '100%'}}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Dialog>
  );
};

export default AppointmentBooking;
