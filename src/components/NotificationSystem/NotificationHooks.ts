import { useState, useEffect, useCallback } from 'react';
import type {
  NotificationSettings,
  Notification,
  SnackbarNotification,
} from '../../types/components';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  isQuietHours,
  playNotificationSound,
  showDesktopNotification,
} from './NotificationUtils';

/**
 * Custom hooks for notification management
 * Extracted to follow Single Responsibility Principle
 */

/**
 * Hook for managing notification settings
 */
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.warn('Failed to parse notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>): void => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    updateSettings,
  };
};

/**
 * Hook for managing notifications
 */
export const useNotificationManager = (settings: NotificationSettings) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Partial<Notification>): void => {
    // Check if notifications are enabled and type is allowed
    if (!settings.enabled || !notification.type || !settings.types[notification.type]) {
      return;
    }

    const newNotification: Notification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      category: 'general',
      priority: 'normal',
      title: '',
      message: '',
      type: 'info',
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound if enabled and not in quiet hours
    if (settings.sound && !isQuietHours(settings.quietHours)) {
      playNotificationSound();
    }

    // Show desktop notification if enabled and not in quiet hours
    if (settings.desktop && !isQuietHours(settings.quietHours)) {
      showDesktopNotification(newNotification);
    }
  }, [settings]);

  const markAsRead = useCallback((id: number): void => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback((): void => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: number): void => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback((): void => {
    setNotifications([]);
  }, []);

  const getNotificationsByCategory = useCallback((category: string): Notification[] => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  const getNotificationsByType = useCallback((type: string): Notification[] => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => !n.read && n.urgent).length;

  return {
    notifications,
    unreadCount,
    urgentCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByType,
  };
};

/**
 * Hook for managing snackbar notifications
 */
export const useSnackbarManager = () => {
  const [snackbars, setSnackbars] = useState<SnackbarNotification[]>([]);

  const addSnackbar = useCallback((snackbar: Partial<SnackbarNotification>): void => {
    const newSnackbar: SnackbarNotification = {
      id: Date.now() + Math.random(),
      message: '',
      severity: 'info',
      autoHideDuration: 4000,
      ...snackbar,
    };
    setSnackbars(prev => [...prev, newSnackbar]);
  }, []);

  const removeSnackbar = useCallback((id: number): void => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  return {
    snackbars,
    addSnackbar,
    removeSnackbar,
  };
};

/**
 * Hook for handling urgent notifications as snackbars
 */
export const useUrgentNotificationHandler = (
  addSnackbar: (snackbar: Partial<SnackbarNotification>) => void
) => {
  const handleUrgentNotification = useCallback((notification: Notification): void => {
    // Show as snackbar if urgent or high priority
    if (notification.urgent || notification.priority === 'high') {
      addSnackbar({
        message: notification.title || '',
        severity: notification.type === 'error' ? 'error' :
          notification.type === 'warning' ? 'warning' :
            notification.type === 'success' ? 'success' : 'info',
        autoHideDuration: notification.urgent ? 8000 : 6000,
      });
    }
  }, [addSnackbar]);

  return { handleUrgentNotification };
};
