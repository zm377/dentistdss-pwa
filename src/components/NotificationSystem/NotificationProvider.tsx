import React from 'react';
import { NotificationContext } from './NotificationContext';
import {
  useNotificationSettings,
  useNotificationManager,
  useSnackbarManager,
  useUrgentNotificationHandler,
} from './NotificationHooks';
import { requestDesktopPermission } from './NotificationUtils';
import type { NotificationProviderProps } from '../../types/components';
import { SnackbarContainer } from './SnackbarContainer';

/**
 * Notification Provider Component
 * Manages all notification state and provides context to children
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { settings, updateSettings } = useNotificationSettings();
  const {
    notifications,
    unreadCount,
    urgentCount,
    addNotification: addNotificationBase,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByType,
  } = useNotificationManager(settings);

  const { snackbars, addSnackbar, removeSnackbar } = useSnackbarManager();
  const { handleUrgentNotification } = useUrgentNotificationHandler(addSnackbar);

  // Enhanced addNotification that also handles urgent notifications
  const addNotification = (notification: Parameters<typeof addNotificationBase>[0]) => {
    addNotificationBase(notification);
    
    // Handle urgent notifications as snackbars
    if (notification.urgent || notification.priority === 'high') {
      handleUrgentNotification({
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        read: false,
        category: 'general',
        priority: 'normal',
        title: '',
        message: '',
        type: 'info',
        ...notification,
      });
    }
  };

  const value = {
    notifications,
    snackbars,
    unreadCount,
    urgentCount,
    settings,
    addNotification,
    addSnackbar,
    removeSnackbar,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,
    getNotificationsByCategory,
    getNotificationsByType,
    requestDesktopPermission,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <SnackbarContainer />
    </NotificationContext.Provider>
  );
};
