import { useState, useEffect, useCallback } from 'react';
import api from '../services';
import type {
  SystemSetting,
  SystemSettingData,
  SystemSettingValidationErrors
} from '../types/api';
import type { UseSystemSettingsReturn } from '../types/components';

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
const useSystemSettings = (): UseSystemSettingsReturn => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  /**
   * Load system settings from API
   */
  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.system.getSystemSettings();
      
      // Handle different response formats
      let settingsData: SystemSetting[] = [];
      if (Array.isArray(response)) {
        settingsData = response.map(item => ({
          ...item,
          createdAt: (item as any).createdAt || new Date().toISOString(),
          updatedAt: (item as any).updatedAt || new Date().toISOString()
        }));
      } else if (response && Array.isArray((response as any).data)) {
        settingsData = (response as any).data.map((item: any) => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }));
      } else if (response && Array.isArray((response as any).dataObject)) {
        settingsData = (response as any).dataObject.map((item: any) => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }));
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
   * @param settingData - Setting data object
   * @returns Promise that resolves when setting is saved
   */
  const saveSetting = useCallback(async (settingData: SystemSettingData): Promise<void> => {
    setSaving(true);
    setError('');

    try {
      const response = await api.system.saveSystemSetting(settingData);
      
      // Handle response format
      let savedSetting: SystemSetting = {
        ...response,
        createdAt: (response as any).createdAt || new Date().toISOString(),
        updatedAt: (response as any).updatedAt || new Date().toISOString()
      };
      if (response && (response as any).data) {
        savedSetting = {
          ...(response as any).data,
          createdAt: (response as any).data.createdAt || new Date().toISOString(),
          updatedAt: (response as any).data.updatedAt || new Date().toISOString()
        };
      } else if (response && (response as any).dataObject) {
        savedSetting = {
          ...(response as any).dataObject,
          createdAt: (response as any).dataObject.createdAt || new Date().toISOString(),
          updatedAt: (response as any).dataObject.updatedAt || new Date().toISOString()
        };
      }

      // Update local state optimistically
      setSettings((prevSettings: SystemSetting[]) => {
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
   * @param settingData - Setting data to validate
   * @returns Validation errors object
   */
  const validateSetting = useCallback((settingData: SystemSettingData): SystemSettingValidationErrors => {
    const errors: SystemSettingValidationErrors = {};

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
   * @param key - Setting key to check
   * @param excludeId - ID to exclude from check (for updates)
   * @returns True if key exists, false otherwise
   */
  const isKeyExists = useCallback((key: string, excludeId: number | null = null): boolean => {
    return settings.some(setting =>
      setting.key === key && setting.id !== excludeId
    );
  }, [settings]);

  /**
   * Get setting by key
   * @param key - Setting key
   * @returns Setting object or null if not found
   */
  const getSettingByKey = useCallback((key: string): SystemSetting | null => {
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
