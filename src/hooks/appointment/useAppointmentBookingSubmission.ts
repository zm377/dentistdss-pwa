import { useCallback } from 'react';
import api from '../../services';
import type { Appointment } from '../../types/api';
import type { BookingData, PatientData, ServiceType } from './useAppointmentBooking';
import { validateAppointmentData } from './useAppointmentBookingValidation';

/**
 * Booking submission utilities
 * Extracted to follow Single Responsibility Principle
 */

export interface BookingSubmissionContext {
  currentUser: any;
  bookingData: BookingData;
  patientData: PatientData;
  serviceTypes: ServiceType[];
  confirmationDialog: any;
  onBookingComplete?: (appointment: Appointment) => void;
}

/**
 * Create patient profile for new users
 */
export const createPatientProfile = async (patientData: PatientData): Promise<string> => {
  const newPatient = await api.appointment.createPatient(patientData);
  return String(newPatient.id);
};

/**
 * Get numeric service ID from service type
 */
export const getServiceId = (serviceType: string, serviceTypes: ServiceType[]): number => {
  const selectedService = serviceTypes.find(s => s.id === serviceType);
  if (!selectedService) {
    throw new Error(`Invalid service type: ${serviceType}`);
  }
  return selectedService.serviceId;
};

/**
 * Build appointment data object for API submission
 */
export const buildAppointmentData = (
  context: BookingSubmissionContext,
  patientId: string,
  serviceId: number
) => {
  const { currentUser, bookingData } = context;
  
  return {
    patientId: Number(patientId),
    dentistId: Number(bookingData.dentistId),
    clinicId: Number(bookingData.clinicId),
    createdBy: Number(currentUser?.id || patientId),
    serviceId: serviceId,
    appointmentDate: bookingData.date,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    reasonForVisit: bookingData.reason,
    symptoms: bookingData.symptoms || '',
    urgencyLevel: bookingData.urgency || 'medium',
    notes: bookingData.notes || ''
  };
};

/**
 * Handle booking success
 */
export const handleBookingSuccess = async (
  appointment: Appointment,
  context: BookingSubmissionContext
): Promise<void> => {
  const { currentUser, confirmationDialog, onBookingComplete } = context;
  
  confirmationDialog.showSuccess(
    'Appointment Booked',
    'Your appointment has been successfully booked. You will receive a confirmation email shortly.'
  );

  // Refresh patient appointments to get updated list
  if (currentUser?.roles?.includes('PATIENT')) {
    try {
      await api.appointment.getPatientAppointments(currentUser.id);
    } catch (error) {
      console.error('Failed to refresh appointments:', error);
    }
  }

  if (onBookingComplete) {
    onBookingComplete(appointment);
  }
};

/**
 * Handle booking error
 */
export const handleBookingError = (error: any, confirmationDialog: any): void => {
  console.error('Failed to book appointment:', error);

  // Extract error message from API response
  let errorMessage = 'Failed to book the appointment. Please try again.';
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error.response?.data?.dataObject) {
    // Handle validation errors
    const validationErrors = error.response.data.dataObject;
    const errorFields = Object.keys(validationErrors);
    if (errorFields.length > 0) {
      errorMessage = `Validation failed: ${errorFields.join(', ')}`;
    }
  }

  confirmationDialog.showError('Booking Failed', errorMessage);
};

/**
 * Main booking submission function
 */
export const useBookingSubmission = () => {
  const submitBooking = useCallback(async (
    context: BookingSubmissionContext
  ): Promise<Appointment | false> => {
    const { currentUser, bookingData, patientData, serviceTypes } = context;
    
    try {
      let patientId = currentUser?.id;

      // Create patient profile if user is not logged in
      if (!currentUser) {
        patientId = await createPatientProfile(patientData);
      }

      // Get the numeric service ID from the selected service type
      const numericServiceId = getServiceId(bookingData.serviceType, serviceTypes);

      // Build appointment data with correct API field names
      const appointmentData = buildAppointmentData(context, patientId, numericServiceId);

      // Validate required fields before submission
      const validation = validateAppointmentData(appointmentData);
      if (!validation.isValid) {
        throw new Error(`Missing required fields: ${validation.missingFields.join(', ')}`);
      }

      const newAppointment = await api.appointment.createAppointment(appointmentData);

      await handleBookingSuccess(newAppointment, context);
      
      return newAppointment;
    } catch (error: any) {
      handleBookingError(error, context.confirmationDialog);
      return false;
    }
  }, []);

  return { submitBooking };
};
