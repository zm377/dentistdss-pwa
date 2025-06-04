import api from './config';

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
   * @param {number} dentistId - The dentist's user ID
   * @param {number} clinicId - The clinic ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} serviceDurationMinutes - Duration of service in minutes
   * @returns {Promise<Array>} Array of available slot objects
   */
  async getAvailableSlots(dentistId, clinicId, date, serviceDurationMinutes) {
    return api.get('/api/clinic/appointment/available-slots', {
      params: { dentistId, clinicId, date, serviceDurationMinutes }
    });
  },

  /**
   * Get all appointments for a specific clinic on a date
   * @param {number} clinicId - The clinic ID
   * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
   * @returns {Promise<Array>} Array of appointment objects
   */
  async getClinicAppointments(clinicId, date = null) {
    const params = { clinicId };
    if (date) params.date = date;

    return api.get(`/api/clinic/appointment/clinic/${clinicId}`, { params });
  },

  /**
   * Get all appointments for a specific dentist on a date
   * @param {number} dentistId - The dentist's user ID
   * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
   * @returns {Promise<Array>} Array of appointment objects
   */
  async getDentistAppointments(dentistId, date = null) {
    const params = { dentistId };
    if (date) params.date = date;

    return api.get(`/api/clinic/appointment/dentist/${dentistId}`, { params });
  },

  /**
   * Get all appointments for a specific patient
   * @param {number} patientId - The patient's user ID
   * @returns {Promise<Array>} Array of appointment objects
   */
  async getPatientAppointments(patientId) {
    return api.get(`/api/clinic/appointment/patient/${patientId}`);
  },

  // ===== PATCH ENDPOINTS =====

  /**
   * Reschedule an appointment
   * @param {number} id - Appointment ID
   * @param {string} newDate - New date in YYYY-MM-DD format
   * @param {string} newStartTime - New start time in HH:mm:ss format
   * @param {string} newEndTime - New end time in HH:mm:ss format
   * @param {number} rescheduledBy - User ID of person rescheduling
   * @returns {Promise<Object>} Updated appointment object
   */
  async rescheduleAppointment(id, newDate, newStartTime, newEndTime, rescheduledBy) {
    return api.patch(`/api/clinic/appointment/${id}/reschedule`, {
      newDate,
      newStartTime,
      newEndTime,
      rescheduledBy
    });
  },

  /**
   * Mark appointment as no-show
   * @param {number} id - Appointment ID
   * @returns {Promise<Object>} Updated appointment object
   */
  async markNoShow(id) {
    return api.patch(`/api/clinic/appointment/${id}/no-show`);
  },

  /**
   * Confirm an appointment
   * @param {number} id - Appointment ID
   * @param {number} confirmedBy - User ID of person confirming
   * @returns {Promise<Object>} Updated appointment object
   */
  async confirmAppointment(id, confirmedBy) {
    return api.patch(`/api/clinic/appointment/${id}/confirm`, { confirmedBy });
  },

  /**
   * Mark appointment as complete
   * @param {number} id - Appointment ID
   * @returns {Promise<Object>} Updated appointment object
   */
  async completeAppointment(id) {
    return api.patch(`/api/clinic/appointment/${id}/complete`);
  },

  /**
   * Cancel an appointment
   * @param {number} id - Appointment ID
   * @param {string} reason - Reason for cancellation
   * @param {number} cancelledBy - User ID of person cancelling
   * @returns {Promise<Object>} Updated appointment object
   */
  async cancelAppointment(id, reason, cancelledBy) {
    return api.patch(`/api/clinic/appointment/${id}/cancel`, {
      reason,
      cancelledBy
    });
  },

  // ===== POST ENDPOINTS =====

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data object
   * @param {number} appointmentData.patientId - Patient's user ID
   * @param {number} appointmentData.dentistId - Dentist's user ID
   * @param {number} appointmentData.clinicId - Clinic ID
   * @param {number} appointmentData.createdBy - User ID who created the appointment
   * @param {number} appointmentData.serviceId - Service ID
   * @param {string} appointmentData.appointmentDate - Appointment date in YYYY-MM-DD format
   * @param {string} appointmentData.startTime - Start time in HH:mm:ss format
   * @param {string} appointmentData.endTime - End time in HH:mm:ss format
   * @param {string} appointmentData.reasonForVisit - Reason for appointment
   * @param {string} appointmentData.symptoms - Patient symptoms (optional)
   * @param {string} appointmentData.urgencyLevel - Urgency level (low, medium, high)
   * @param {string} appointmentData.notes - Additional notes (optional)
   * @returns {Promise<Object>} Created appointment object
   */
  async createAppointment(appointmentData) {
    return api.post('/api/clinic/appointment/create', appointmentData);
  },

  /**
   * Create a new patient profile (for first-time bookings)
   * @param {Object} patientData - Patient data object
   * @param {string} patientData.firstName - Patient's first name
   * @param {string} patientData.lastName - Patient's last name
   * @param {string} patientData.email - Patient's email
   * @param {string} patientData.phone - Patient's phone number
   * @param {string} patientData.dateOfBirth - Date of birth in YYYY-MM-DD format
   * @param {string} patientData.address - Patient's address (optional)
   * @param {string} patientData.emergencyContact - Emergency contact info (optional)
   * @returns {Promise<Object>} Created patient object
   */
  async createPatient(patientData) {
    return api.post('/api/patient/add', patientData);
  }
};

export default appointmentAPI;