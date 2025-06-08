import api from './config';

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  description: string;
}

interface SystemSettingData {
  key: string;
  value: string;
  description: string;
}

/**
 * System API Service
 *
 * Provides methods for managing system settings following established patterns
 * from clinic.js and user.js with consistent error handling and response formatting.
 */
const systemAPI = {
  /**
   * Get all system settings
   * @returns Array of setting objects
   */
  async getSystemSettings(): Promise<SystemSetting[]> {
    return api.get('/api/system/setting');
  },

  /**
   * Save system setting (creates new or updates existing based on key)
   * @param settingData - Setting data object
   * @returns Single setting object with same structure plus generated ID
   */
  async saveSystemSetting(settingData: SystemSettingData): Promise<SystemSetting> {
    return api.post('/api/system/setting', settingData);
  },
};

export default systemAPI;