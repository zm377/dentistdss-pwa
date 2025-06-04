import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  Slide,
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ClinicSelectionStep from './steps/ClinicSelectionStep';
import DateTimeSelectionStep from './steps/DateTimeSelectionStep';
import ServiceDetailsStep from './steps/ServiceDetailsStep';
import PatientInfoStep from './steps/PatientInfoStep';
import ConfirmationStep from './steps/ConfirmationStep';

// Transition component for full-screen dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * BookingWizard - Multi-step appointment booking full-screen dialog
 *
 * Features:
 * - 5-step booking process
 * - Full-screen dialog with app bar navigation
 * - Form validation at each step
 * - Responsive design with slide transition
 * - Progress indicator
 * - Patient profile creation for new users
 * - Integrated navigation controls in app bar
 */
const BookingWizard = memo(({
  open,
  onClose,
  currentStep,
  bookingData,
  patientData,
  errors,
  clinics,
  availableSlots,
  serviceTypes,
  loading,
  onUpdateBookingData,
  onUpdatePatientData,
  onNextStep,
  onPreviousStep,
  onSubmitBooking,
  onBookingComplete,
  userRole,
  isLoggedIn = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = [
    'Select Clinic',
    'Choose Date & Time',
    'Service Details',
    ...(isLoggedIn ? [] : ['Patient Information']),
    'Confirmation'
  ];

  const getStepContent = (step) => {
    const adjustedStep = isLoggedIn && step >= 3 ? step + 1 : step;
    
    switch (adjustedStep) {
      case 0:
        return (
          <ClinicSelectionStep
            clinics={clinics}
            selectedClinic={bookingData.clinicId}
            onSelectClinic={(clinicId) => onUpdateBookingData('clinicId', clinicId)}
            error={errors.clinicId}
            loading={loading}
          />
        );
      case 1:
        return (
          <DateTimeSelectionStep
            selectedClinic={bookingData.clinicId}
            selectedDate={bookingData.date}
            selectedTime={bookingData.startTime}
            selectedDentist={bookingData.dentistId}
            availableSlots={availableSlots}
            onSelectDate={(date) => onUpdateBookingData('date', date)}
            onSelectTime={(startTime, endTime) => {
              onUpdateBookingData('startTime', startTime);
              onUpdateBookingData('endTime', endTime);
            }}
            onSelectDentist={(dentistId) => onUpdateBookingData('dentistId', dentistId)}
            errors={errors}
            loading={loading}
          />
        );
      case 2:
        return (
          <ServiceDetailsStep
            serviceTypes={serviceTypes}
            selectedService={bookingData.serviceType}
            reason={bookingData.reason}
            symptoms={bookingData.symptoms}
            urgency={bookingData.urgency}
            notes={bookingData.notes}
            onSelectService={(serviceType) => onUpdateBookingData('serviceType', serviceType)}
            onUpdateReason={(reason) => onUpdateBookingData('reason', reason)}
            onUpdateSymptoms={(symptoms) => onUpdateBookingData('symptoms', symptoms)}
            onUpdateUrgency={(urgency) => onUpdateBookingData('urgency', urgency)}
            onUpdateNotes={(notes) => onUpdateBookingData('notes', notes)}
            errors={errors}
          />
        );
      case 3:
        return (
          <PatientInfoStep
            patientData={patientData}
            onUpdatePatientData={onUpdatePatientData}
            errors={errors}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            bookingData={bookingData}
            patientData={patientData}
            clinics={clinics}
            serviceTypes={serviceTypes}
            isLoggedIn={isLoggedIn}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    if (isLastStep) {
      // Submit booking
      const result = await onSubmitBooking();
      if (result && onBookingComplete) {
        // onSubmitBooking should return the new appointment data
        onBookingComplete(result);
      }
    } else {
      onNextStep();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      {/* Full-screen App Bar */}
      <AppBar
        sx={{
          position: 'relative',
          backgroundColor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{ mr: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            Book New Appointment
          </Typography>
          {!isFirstStep && (
            <Button
              color="inherit"
              onClick={onPreviousStep}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
              Go Back 
            </Button>
          )}
          <Button
            color="inherit"
            onClick={handleNext}
            disabled={loading}
            variant="outlined"
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {loading ? 'Processing...' : isLastStep ? 'Book Appointment' : 'Next'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Progress Stepper */}
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Stepper
            activeStep={currentStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{
              '& .MuiStepLabel-root': {
                fontSize: isMobile ? '0.875rem' : '1rem',
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box
          sx={{
            flex: 1,
            px: 3,
            pb: 3,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {getStepContent(currentStep)}
        </Box>
      </Box>
    </Dialog>
  );
});

BookingWizard.propTypes = {
  /** Whether the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Callback to close the dialog */
  onClose: PropTypes.func.isRequired,
  /** Current step index */
  currentStep: PropTypes.number.isRequired,
  /** Booking form data */
  bookingData: PropTypes.object.isRequired,
  /** Patient form data */
  patientData: PropTypes.object.isRequired,
  /** Form validation errors */
  errors: PropTypes.object.isRequired,
  /** Available clinics */
  clinics: PropTypes.array.isRequired,
  /** Available time slots */
  availableSlots: PropTypes.array.isRequired,
  /** Available service types */
  serviceTypes: PropTypes.array.isRequired,
  /** Loading state */
  loading: PropTypes.bool.isRequired,
  /** Callback to update booking data */
  onUpdateBookingData: PropTypes.func.isRequired,
  /** Callback to update patient data */
  onUpdatePatientData: PropTypes.func.isRequired,
  /** Callback to go to next step */
  onNextStep: PropTypes.func.isRequired,
  /** Callback to go to previous step */
  onPreviousStep: PropTypes.func.isRequired,
  /** Callback to submit booking */
  onSubmitBooking: PropTypes.func.isRequired,
  /** Callback when booking is completed */
  onBookingComplete: PropTypes.func,
  /** User role */
  userRole: PropTypes.string,
  /** Whether user is logged in */
  isLoggedIn: PropTypes.bool,
};

BookingWizard.displayName = 'BookingWizard';

export default BookingWizard;
