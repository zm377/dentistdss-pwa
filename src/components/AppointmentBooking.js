import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AppointmentBooking = ({ open, onClose, onBookingComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [dentists] = useState([
    { id: 'dr-smith', name: 'Dr. Jane Smith', specialty: 'General Dentistry', available: true },
    { id: 'dr-johnson', name: 'Dr. Mike Johnson', specialty: 'Orthodontics', available: true },
    { id: 'dr-brown', name: 'Dr. Sarah Brown', specialty: 'Oral Surgery', available: false },
  ]);

  const [services] = useState([
    { id: 'checkup', name: 'Regular Checkup', duration: 30, price: 150 },
    { id: 'cleaning', name: 'Dental Cleaning', duration: 45, price: 120 },
    { id: 'filling', name: 'Dental Filling', duration: 60, price: 200 },
    { id: 'extraction', name: 'Tooth Extraction', duration: 90, price: 300 },
    { id: 'consultation', name: 'Consultation', duration: 30, price: 100 },
  ]);

  const [availableSlots] = useState([
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ]);

  const steps = ['Select Service', 'Choose Dentist', 'Pick Date & Time', 'Confirm Details'];

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appointmentData = {
        service: selectedService,
        dentist: selectedDentist,
        date: selectedDate,
        time: selectedTime,
        notes: patientNotes,
      };

      setSnackbar({
        open: true,
        message: 'Appointment booked successfully! You will receive a confirmation email shortly.',
        severity: 'success'
      });

      if (onBookingComplete) {
        onBookingComplete(appointmentData);
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
      setSnackbar({
        open: true,
        message: 'Failed to book appointment. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0: return selectedService !== '';
      case 1: return selectedDentist !== '';
      case 2: return selectedTime !== null;
      case 3: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Select a Service</Typography>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MedicalServicesIcon sx={{ mr: 1 }} />
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
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Choose Your Dentist</Typography>
            <RadioGroup
              value={selectedDentist}
              onChange={(e) => setSelectedDentist(e.target.value)}
            >
              {dentists.map((dentist) => (
                <Card key={dentist.id} sx={{ mb: 2, opacity: dentist.available ? 1 : 0.6 }}>
                  <CardContent>
                    <FormControlLabel
                      value={dentist.id}
                      control={<Radio />}
                      disabled={!dentist.available}
                      label={
                        <Box sx={{ ml: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PersonIcon sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="medium">
                              {dentist.name}
                            </Typography>
                            {!dentist.available && (
                              <Chip label="Unavailable" size="small" color="error" sx={{ ml: 1 }} />
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
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <EventIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Calendar component will be available after installing @mui/x-date-pickers
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>Available Times</Typography>
                <Grid container spacing={1}>
                  {availableSlots.map((slot) => (
                    <Grid item xs={6} sm={4} key={slot}>
                      <Button
                        variant={selectedTime === slot ? 'contained' : 'outlined'}
                        fullWidth
                        size="small"
                        onClick={() => setSelectedTime(slot)}
                        startIcon={<ScheduleIcon />}
                      >
                        {slot}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        const selectedServiceData = services.find(s => s.id === selectedService);
        const selectedDentistData = dentists.find(d => d.id === selectedDentist);
        
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Confirm Your Appointment</Typography>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                    <Typography variant="body1">{selectedServiceData?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Dentist</Typography>
                    <Typography variant="body1">{selectedDentistData?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                    <Typography variant="body1">{selectedDate.toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Time</Typography>
                    <Typography variant="body1">{selectedTime}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Total Cost</Typography>
                    <Typography variant="h6" color="primary">${selectedServiceData?.price}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Notes (Optional)"
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="Any specific concerns or requests..."
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { minHeight: '500px' } }}
      >
        <DialogTitle>
          <Typography variant="h5">Book an Appointment</Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          {renderStepContent()}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleBack} 
            disabled={activeStep === 0 || loading}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid() || loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {activeStep === steps.length - 1 ? 'Book Appointment' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppointmentBooking;
