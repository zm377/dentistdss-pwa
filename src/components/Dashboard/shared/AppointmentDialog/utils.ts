import type { Appointment, EditData, ValidationErrors, DialogMode } from './types';

/**
 * AppointmentDialog utility functions
 * Extracted to follow Single Responsibility Principle
 */

/**
 * Initialize edit data from appointment
 */
export const initializeEditData = (appointment?: Appointment | null): EditData => {
  if (!appointment) {
    return {
      date: '',
      startTime: '',
      endTime: '',
      reason: '',
      symptoms: '',
      notes: '',
      urgency: 'medium',
    };
  }

  return {
    date: appointment.appointmentDate || appointment.date || '',
    startTime: appointment.startTime || '',
    endTime: appointment.endTime || '',
    reason: appointment.reasonForVisit || '',
    symptoms: appointment.symptoms || '',
    notes: appointment.notes || '',
    urgency: appointment.urgencyLevel || 'medium',
  };
};

/**
 * Validate edit data based on mode
 */
export const validateEditData = (editData: EditData, mode: DialogMode): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (mode === 'reschedule') {
    if (!editData.date) errors.date = 'Date is required';
    if (!editData.startTime) errors.startTime = 'Start time is required';
    if (!editData.endTime) errors.endTime = 'End time is required';
  }

  if (mode === 'edit') {
    if (!editData.reason?.trim()) errors.reason = 'Reason is required';
  }

  return errors;
};

/**
 * Get dialog title based on mode
 */
export const getDialogTitle = (mode: DialogMode): string => {
  switch (mode) {
    case 'edit':
      return 'Edit Appointment';
    case 'reschedule':
      return 'Reschedule Appointment';
    default:
      return 'Appointment Details';
  }
};

/**
 * Check if dialog is in edit mode
 */
export const canEdit = (mode: DialogMode): boolean => {
  return mode === 'edit' || mode === 'reschedule';
};

/**
 * Get patient display name
 */
export const getPatientName = (appointment: Appointment): string => {
  return appointment.patientName || 'Unknown Patient';
};

/**
 * Get dentist display name
 */
export const getDentistName = (appointment: Appointment): string => {
  return `Dr. ${appointment.dentistName || 'Unknown'}`;
};

/**
 * Get service display name
 */
export const getServiceName = (appointment: Appointment): string => {
  return appointment.serviceName || appointment.serviceType || 'Not specified';
};

/**
 * Get urgency display value
 */
export const getUrgencyDisplay = (appointment: Appointment): string => {
  const urgency = appointment.urgencyLevel || 'Medium';
  return urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase();
};

/**
 * Get reason display value
 */
export const getReasonDisplay = (appointment: Appointment): string => {
  return appointment.reasonForVisit || 'No reason provided';
};

/**
 * Get symptoms display value
 */
export const getSymptomsDisplay = (appointment: Appointment): string => {
  return appointment.symptoms || 'No symptoms reported';
};

/**
 * Get notes display value
 */
export const getNotesDisplay = (appointment: Appointment): string => {
  return appointment.notes || 'No additional notes';
};
