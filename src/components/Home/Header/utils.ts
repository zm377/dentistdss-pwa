import type { User } from './types';

/**
 * Header utility functions
 * Extracted to follow Single Responsibility Principle
 */

/**
 * Get display name from user object
 */
export const getDisplayName = (user?: User | null): string => {
  if (!user) return 'Guest';
  
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  
  return user.name || user.username || user.email || 'User';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user?: User | null): string => {
  if (!user) return '?';
  
  const first = user.firstName || user.name?.split(' ')[0] || '';
  const last = user.lastName || user.name?.split(' ')[1] || '';
  
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first[0].toUpperCase();
  if (user.email) return user.email[0].toUpperCase();
  
  return '?';
};

/**
 * Get avatar source URL
 */
export const getAvatarSrc = (user?: User | null): string => {
  return user?.avatarUrl || user?.photoURL || user?.profilePicture || '';
};

/**
 * Check if user has avatar image
 */
export const hasAvatarImage = (user?: User | null): boolean => {
  return Boolean(getAvatarSrc(user));
};
