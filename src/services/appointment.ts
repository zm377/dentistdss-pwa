import api from './config';
import {
  Appointment,
  CreateAppointmentRequest,
  CreatePatientRequest,
  TimeSlot,
  Patient
} from '../types';

/**
 * Appointment API Service
 *
 * Provides methods for managing appointments following established patterns
 * from clinic.js and approval.js with consistent error handling and response formatting.
 */
const appointmentAPI = {
  // ===== GET ENDPOINTS =====

  /**
   * Get available time slots for booking
   * @param dentistId - The dentist's user ID
   * @param clinicId - The clinic ID
   * @param date - Date in YYYY-MM-DD format
   * @param serviceDurationMinutes - Duration of service in minutes
   * @returns Array of available slot objects
   */
  async getAvailableSlots(dentistId: number, clinicId: number, date: string, serviceDurationMinutes: number): Promise<TimeSlot[]> {
    return api.get('/api/clinic/appointment/available-slots', {
      params: { dentistId, clinicId, date, serviceDurationMinutes }
    });
  },

  /**
   * Get all appointments for a specific clinic on a date
   * @param clinicId - The clinic ID
   * @param date - Date in YYYY-MM-DD format (optional, defaults to today)
   * @returns Array of appointment objects
   */
  async getClinicAppointments(clinicId: number, date: string | null = null): Promise<Appointment[]> {
    const params: any = { clinicId };
    if (date) params.date = date;

    return api.get(`/api/clinic/appointment/clinic/${clinicId}`, { params });
  },

  /**
   * Get all appointments for a specific dentist on a date
   * @param dentistId - The dentist's user ID
   * @param date - Date in YYYY-MM-DD format (optional, defaults to today)
   * @returns Array of appointment objects
   */
  async getDentistAppointments(dentistId: number, date: string | null = null): Promise<Appointment[]> {
    const params: any = { dentistId };
    if (date) params.date = date;

    return api.get(`/api/clinic/appointment/dentist/${dentistId}`, { params });
  },

  /**
   * Get all appointments for a specific patient
   * @param patientId - The patient's user ID
   * @returns Array of appointment objects
   */
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    return api.get(`/api/clinic/appointment/patient/${patientId}`);
  },

  // ===== PATCH ENDPOINTS =====

  /**
   * Reschedule an appointment
   * @param id - Appointment ID
   * @param newDate - New date in YYYY-MM-DD format
   * @param newStartTime - New start time in HH:mm:ss format
   * @param newEndTime - New end time in HH:mm:ss format
   * @param rescheduledBy - User ID of person rescheduling
   * @returns Updated appointment object
   */
  async rescheduleAppointment(id: number, newDate: string, newStartTime: string, newEndTime: string, rescheduledBy: number): Promise<Appointment> {
    return api.patch(`/api/clinic/appointment/${id}/reschedule`, {
      newDate,
      newStartTime,
      newEndTime,
      rescheduledBy
    });
  },

  /**
   * Mark appointment as no-show
   * @param id - Appointment ID
   * @returns Updated appointment object
   */
  async markNoShow(id: number): Promise<Appointment> {
    return api.patch(`/api/clinic/appointment/${id}/no-show`);
  },

  /**
   * Confirm an appointment
   * @param id - Appointment ID
   * @param confirmedBy - User ID of person confirming
   * @returns Updated appointment object
   */
  async confirmAppointment(id: number, confirmedBy: number): Promise<Appointment> {
    return api.patch(`/api/clinic/appointment/${id}/confirm`, { confirmedBy });
  },

  /**
   * Mark appointment as complete
   * @param id - Appointment ID
   * @returns Updated appointment object
   */
  async completeAppointment(id: number): Promise<Appointment> {
    return api.patch(`/api/clinic/appointment/${id}/complete`);
  },

  /**
   * Cancel an appointment
   * @param id - Appointment ID
   * @param reason - Reason for cancellation
   * @param cancelledBy - User ID of person cancelling
   * @returns Updated appointment object
   */
  async cancelAppointment(id: number, reason: string, cancelledBy: number): Promise<Appointment> {
    return api.patch(`/api/clinic/appointment/${id}/cancel`, {
      reason,
      cancelledBy
    });
  },

  // ===== POST ENDPOINTS =====

  /**
   * Create a new appointment
   * @param appointmentData - Appointment data object with exact field names from API
   * @returns Created appointment object
   */
  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    return api.post('/api/clinic/appointment/create', appointmentData);
  },

  /**
   * Create a new patient profile (for first-time bookings)
   * @param patientData - Patient data object
   * @returns Created patient object
   */
  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    return api.post('/api/patient/add', patientData);
  }
};

export default appointmentAPI;