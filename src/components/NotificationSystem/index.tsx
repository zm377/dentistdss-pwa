/**
 * Notification System - Refactored into smaller, focused modules
 * 
 * This module provides a complete notification system with:
 * - Context-based state management
 * - Snackbar notifications
 * - Desktop notifications
 * - Sound notifications
 * - Notification settings
 * - Notification drawer
 * 
 * Architecture follows SOLID principles:
 * - Single Responsibility: Each file has one clear purpose
 * - Open/Closed: Easy to extend with new notification types
 * - Liskov Substitution: Components can be swapped easily
 * - Interface Segregation: Clean, focused interfaces
 * - Dependency Inversion: Depends on abstractions, not concretions
 */

// Context and hooks
export { useNotifications } from './NotificationContext';
export { NotificationProvider } from './NotificationProvider';

// Components
export { NotificationBell } from './NotificationBell';
export { SnackbarContainer } from './SnackbarContainer';
export { NotificationDrawer } from './NotificationDrawer';
export { NotificationList } from './NotificationList';
export { NotificationSettings } from './NotificationSettings';

// Utilities
export * from './NotificationUtils';

// Hooks
export * from './NotificationHooks';

// Re-export types
export type {
  NotificationSettings as NotificationSettingsType,
  Notification,
  SnackbarNotification,
  NotificationContextType,
  NotificationProviderProps,
} from '../../types/components';
