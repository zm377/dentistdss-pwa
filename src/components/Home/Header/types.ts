/**
 * Header component types
 * Extracted to follow Single Responsibility Principle
 */

export interface User {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  photoURL?: string;
  profilePicture?: string;
}

export interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentUser?: User | null;
  isMobile?: boolean;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  requiresAuth?: boolean;
}

export interface HeaderState {
  mobileMenuAnchorEl: HTMLElement | null;
  profileMenuAnchor: HTMLElement | null;
  scrolled: boolean;
}
