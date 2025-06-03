import api from './config';

/**
 * System API Service
 *
 * Provides methods for managing system settings following established patterns
 * from clinic.js and user.js with consistent error handling and response formatting.
 */
const systemAPI = {
  /**
   * Get all system settings
   * @returns {Promise<Array>} Array of setting objects with structure: {id: number, key: string, value: string, description: string}
   */
  async getSystemSettings() {
    return api.get('/api/system/setting');
  },

  /**
   * Save system setting (creates new or updates existing based on key)
   * @param {Object} settingData - Setting data object
   * @param {string} settingData.key - Setting key identifier
   * @param {string} settingData.value - Setting value
   * @param {string} settingData.description - Setting description
   * @returns {Promise<Object>} Single setting object with same structure plus generated ID
   */
  async saveSystemSetting(settingData) {
    return api.post('/api/system/setting', settingData);
  },
};

export default systemAPI;