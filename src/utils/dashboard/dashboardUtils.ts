/**
 * Dashboard utility functions for common operations
 */

interface User {
  id?: string | number;
  displayName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

type SortDirection = 'asc' | 'desc';
type StatusColor = 'default' | 'success' | 'warning' | 'error';

/**
 * Get display name from user object
 */
export const getDisplayName = (user?: User): string => {
  if (!user) return 'Unknown User';
  return user.displayName || user.name || user.firstName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : user.email || 'Unknown User';
};

/**
 * Get user initials from user object
 */
export const getInitials = (user?: User): string => {
  if (!user) return 'U';

  const displayName = getDisplayName(user);
  const nameParts = displayName.split(' ').filter(part => part.length > 0);

  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  } else if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }

  return 'U';
};

/**
 * Format date for display
 */
export const formatDate = (date?: string | Date): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

/**
 * Format time for display (supports "HH:mm:ss" format or Date object)
 */
export const formatTime = (time?: string | Date): string => {
  if (!time) return 'N/A';

  // Handle time string in "HH:mm:ss" format
  if (typeof time === 'string' && time.includes(':')) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    // Create a date object for today with the specified time
    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Handle Date object
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (datetime?: string | Date): string => {
  if (!datetime) return 'N/A';
  return new Date(datetime).toLocaleString();
};

/**
 * Get status color based on status string
 */
export const getStatusColor = (status?: string): StatusColor => {
  if (!status) return 'default';
  
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('confirmed') || statusLower.includes('approved') || statusLower.includes('active')) {
    return 'success';
  }
  if (statusLower.includes('pending') || statusLower.includes('waiting')) {
    return 'warning';
  }
  if (statusLower.includes('cancelled') || statusLower.includes('rejected') || statusLower.includes('inactive')) {
    return 'error';
  }
  
  return 'default';
};

/**
 * Filter items based on search term
 */
export const filterItems = <T extends Record<string, any>>(
  items?: T[],
  searchTerm?: string,
  searchFields: string[] = []
): T[] => {
  if (!searchTerm || !items) return items || [];

  const term = searchTerm.toLowerCase();

  return items.filter(item => {
    // If no specific fields provided, search all string values
    if (searchFields.length === 0) {
      return Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(term)
      );
    }

    // Search specific fields
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return typeof value === 'string' && value.toLowerCase().includes(term);
    });
  });
};

/**
 * Get nested object value by dot notation
 */
export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Sort items by field
 */
export const sortItems = <T extends Record<string, any>>(
  items?: T[],
  field?: string,
  direction: SortDirection = 'asc'
): T[] => {
  if (!items || !field) return items || [];

  return [...items].sort((a, b) => {
    const aValue = getNestedValue(a, field);
    const bValue = getNestedValue(b, field);

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text?: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRoles?: string[], requiredRole?: string): boolean => {
  if (!userRoles || !requiredRole) return false;
  return userRoles.includes(requiredRole);
};

/**
 * Get user's primary role (first role in array)
 */
export const getPrimaryRole = (userRoles?: string[]): string | null => {
  if (!userRoles || userRoles.length === 0) return null;
  return userRoles[0];
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
