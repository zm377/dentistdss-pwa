/**
 * Dashboard utility functions for common operations
 */

/**
 * Get display name from user object
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return user.displayName || user.name || user.firstName 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : user.email || 'Unknown User';
};

/**
 * Get user initials from user object
 * @param {Object} user - User object
 * @returns {string} User initials
 */
export const getInitials = (user) => {
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
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

/**
 * Format time for display
 * @param {string|Date} time - Time to format
 * @returns {string} Formatted time
 */
export const formatTime = (time) => {
  if (!time) return 'N/A';
  return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format date and time for display
 * @param {string|Date} datetime - DateTime to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (datetime) => {
  if (!datetime) return 'N/A';
  return new Date(datetime).toLocaleString();
};

/**
 * Get status color based on status string
 * @param {string} status - Status string
 * @returns {string} MUI color
 */
export const getStatusColor = (status) => {
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
 * @param {Array} items - Items to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered items
 */
export const filterItems = (items, searchTerm, searchFields = []) => {
  if (!searchTerm || !items) return items;
  
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
 * @param {Object} obj - Object to search
 * @param {string} path - Dot notation path
 * @returns {any} Value at path
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Sort items by field
 * @param {Array} items - Items to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - 'asc' or 'desc'
 * @returns {Array} Sorted items
 */
export const sortItems = (items, field, direction = 'asc') => {
  if (!items || !field) return items;
  
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
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if user has specific role
 * @param {Array} userRoles - User's roles
 * @param {string} requiredRole - Required role
 * @returns {boolean} Has role
 */
export const hasRole = (userRoles, requiredRole) => {
  if (!userRoles || !requiredRole) return false;
  return userRoles.includes(requiredRole);
};

/**
 * Get user's primary role (first role in array)
 * @param {Array} userRoles - User's roles
 * @returns {string} Primary role
 */
export const getPrimaryRole = (userRoles) => {
  if (!userRoles || userRoles.length === 0) return null;
  return userRoles[0];
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
