import { useState, useEffect, useCallback } from 'react';
import api from '../services';

/**
 * Custom hook for managing system settings
 * 
 * Features:
 * - Load system settings from API
 * - Add new settings
 * - Update existing settings
 * - Form validation
 * - Loading and error state management
 * - Optimistic updates
 */
const useSystemSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /**
   * Load system settings from API
   */
  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.system.getSystemSettings();
      
      // Handle different response formats
      let settingsData = [];
      if (Array.isArray(response)) {
        settingsData = response;
      } else if (response && Array.isArray(response.data)) {
        settingsData = response.data;
      } else if (response && Array.isArray(response.dataObject)) {
        settingsData = response.dataObject;
      } else {
        settingsData = [];
      }

      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load system settings:', err);
      setError('Failed to load system settings. Please try again later.');
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save system setting (create new or update existing)
   * @param {Object} settingData - Setting data object
   * @param {string} settingData.key - Setting key identifier
   * @param {string} settingData.value - Setting value
   * @param {string} settingData.description - Setting description
   * @returns {Promise<Object>} Saved setting object
   */
  const saveSetting = useCallback(async (settingData) => {
    setSaving(true);
    setError('');

    try {
      const response = await api.system.saveSystemSetting(settingData);
      
      // Handle response format
      let savedSetting = response;
      if (response && response.data) {
        savedSetting = response.data;
      } else if (response && response.dataObject) {
        savedSetting = response.dataObject;
      }

      // Update local state optimistically
      setSettings(prevSettings => {
        const existingIndex = prevSettings.findIndex(s => s.key === settingData.key);
        
        if (existingIndex >= 0) {
          // Update existing setting
          const updatedSettings = [...prevSettings];
          updatedSettings[existingIndex] = savedSetting;
          return updatedSettings;
        } else {
          // Add new setting
          return [...prevSettings, savedSetting];
        }
      });

      return savedSetting;
    } catch (err) {
      console.error('Failed to save system setting:', err);
      setError('Failed to save setting. Please try again.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  /**
   * Validate setting data
   * @param {Object} settingData - Setting data to validate
   * @returns {Object} Validation errors object
   */
  const validateSetting = useCallback((settingData) => {
    const errors = {};

    if (!settingData.key || !settingData.key.trim()) {
      errors.key = 'Setting key is required';
    } else if (settingData.key.length < 2) {
      errors.key = 'Setting key must be at least 2 characters';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(settingData.key)) {
      errors.key = 'Setting key can only contain letters, numbers, underscores, dots, and hyphens';
    }

    if (!settingData.value || !settingData.value.trim()) {
      errors.value = 'Setting value is required';
    }

    if (!settingData.description || !settingData.description.trim()) {
      errors.description = 'Setting description is required';
    } else if (settingData.description.length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    return errors;
  }, []);

  /**
   * Check if a setting key already exists
   * @param {string} key - Setting key to check
   * @param {number} excludeId - ID to exclude from check (for updates)
   * @returns {boolean} True if key exists, false otherwise
   */
  const isKeyExists = useCallback((key, excludeId = null) => {
    return settings.some(setting => 
      setting.key === key && setting.id !== excludeId
    );
  }, [settings]);

  /**
   * Get setting by key
   * @param {string} key - Setting key
   * @returns {Object|null} Setting object or null if not found
   */
  const getSettingByKey = useCallback((key) => {
    return settings.find(setting => setting.key === key) || null;
  }, [settings]);

  /**
   * Refresh settings data
   */
  const refreshSettings = useCallback(() => {
    loadSettings();
  }, [loadSettings]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    saveSetting,
    validateSetting,
    isKeyExists,
    getSettingByKey,
    refreshSettings,
    clearError,
  };
};

export default useSystemSettings;
