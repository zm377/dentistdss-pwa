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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import ClinicSelectionStep from './steps/ClinicSelectionStep';
import DateTimeSelectionStep from './steps/DateTimeSelectionStep';
import ServiceDetailsStep from './steps/ServiceDetailsStep';
import PatientInfoStep from './steps/PatientInfoStep';
import ConfirmationStep from './steps/ConfirmationStep';

/**
 * BookingWizard - Multi-step appointment booking dialog
 * 
 * Features:
 * - 5-step booking process
 * - Form validation at each step
 * - Responsive design
 * - Progress indicator
 * - Patient profile creation for new users
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

  const handleNext = () => {
    if (isLastStep) {
      onSubmitBooking();
    } else {
      onNextStep();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          minHeight: isMobile ? '100vh' : '600px',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
      }}>
        Book New Appointment
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* Progress Stepper */}
        <Box sx={{ mb: 4 }}>
          <Stepper 
            activeStep={currentStep} 
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step Content */}
        <Box sx={{ minHeight: '400px' }}>
          {getStepContent(currentStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
        >
          Cancel
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        {!isFirstStep && (
          <Button
            onClick={onPreviousStep}
            color="inherit"
            disabled={loading}
          >
            Back
          </Button>
        )}
        
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Processing...' : isLastStep ? 'Book Appointment' : 'Next'}
        </Button>
      </DialogActions>
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
  /** User role */
  userRole: PropTypes.string,
  /** Whether user is logged in */
  isLoggedIn: PropTypes.bool,
};

BookingWizard.displayName = 'BookingWizard';

export default BookingWizard;
