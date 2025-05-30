import api from './config';

const clinicAPI = {
  async getClinics() {
    return api.get('/api/clinic/list/all');
  },
  async searchClinics(keywords) {
    return api.post('/api/clinic/search', {keywords});
  },

  // Schedule Management API Methods

  /**
   * Get dentist availability for a date range
   * @param {number} dentistId - The dentist's user ID
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of availability objects
   */
  async getDentistAvailability(dentistId, startDate, endDate) {
    return api.get(`/api/clinic/dentist-availability/dentist/${dentistId}`, {
      params: { startDate, endDate }
    });
  },

  /**
   * Get dentist availability for a specific date
   * @param {number} dentistId - The dentist's user ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of availability objects
   */
  async getDentistAvailabilityByDate(dentistId, date) {
    return api.get(`/api/clinic/dentist-availability/dentist/${dentistId}/date/${date}`);
  },

  /**
   * Get available slots for a dentist
   * @param {number} dentistId - The dentist's user ID
   * @param {number} clinicId - The clinic ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of available slot objects
   */
  async getAvailableSlots(dentistId, clinicId, date) {
    return api.get('/api/clinic/dentist-availability/available-slots', {
      params: { dentistId, clinicId, date }
    });
  },

  /**
   * Create new availability slot
   * @param {Object} availabilityData - Availability data object
   * @param {number} availabilityData.dentistId - The dentist's user ID
   * @param {number} availabilityData.clinicId - The clinic ID
   * @param {number} availabilityData.dayOfWeek - Day of week (0=Sunday, 1=Monday, etc.)
   * @param {string} availabilityData.startTime - Start time in HH:mm:ss format
   * @param {string} availabilityData.endTime - End time in HH:mm:ss format
   * @param {boolean} availabilityData.isRecurring - Whether this is a recurring slot
   * @param {string} availabilityData.effectiveFrom - Effective from date in YYYY-MM-DD format
   * @param {string} availabilityData.effectiveUntil - Effective until date in YYYY-MM-DD format
   * @returns {Promise<Object>} Created availability object
   */
  async createAvailability(availabilityData) {
    return api.post('/api/clinic/dentist-availability', availabilityData);
  },

  /**
   * Block an availability slot
   * @param {number} id - Availability slot ID
   * @param {string} reason - Reason for blocking
   * @returns {Promise<Object>} Updated availability object
   */
  async blockAvailabilitySlot(id, reason) {
    return api.put(`/api/clinic/dentist-availability/${id}/block`, { reason });
  },

  /**
   * Unblock an availability slot
   * @param {number} id - Availability slot ID
   * @returns {Promise<Object>} Updated availability object
   */
  async unblockAvailabilitySlot(id) {
    return api.put(`/api/clinic/dentist-availability/${id}/unblock`);
  },

  /**
   * Delete an availability slot
   * @param {number} id - Availability slot ID
   * @returns {Promise<void>} Success response
   */
  async deleteAvailabilitySlot(id) {
    return api.delete(`/api/clinic/dentist-availability/${id}`);
  }
}

export default clinicAPI;