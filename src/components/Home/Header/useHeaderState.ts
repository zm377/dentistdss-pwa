import { useState, useEffect, useCallback } from 'react';
import { SCROLL_THRESHOLD } from './constants';
import type { HeaderState } from './types';

/**
 * Custom hook for header state management
 * Extracted to follow Single Responsibility Principle
 */
export const useHeaderState = () => {
  const [state, setState] = useState<HeaderState>({
    mobileMenuAnchorEl: null,
    profileMenuAnchor: null,
    scrolled: false,
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setState(prev => ({
        ...prev,
        scrolled: offset > SCROLL_THRESHOLD
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu handlers
  const handleMobileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setState(prev => ({
      ...prev,
      mobileMenuAnchorEl: event.currentTarget
    }));
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setState(prev => ({
      ...prev,
      mobileMenuAnchorEl: null
    }));
  }, []);

  // Profile menu handlers
  const handleProfileMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setState(prev => ({
      ...prev,
      profileMenuAnchor: event.currentTarget
    }));
  }, []);

  const handleProfileMenuClose = useCallback(() => {
    setState(prev => ({
      ...prev,
      profileMenuAnchor: null
    }));
  }, []);

  return {
    ...state,
    handleMobileMenuOpen,
    handleMobileMenuClose,
    handleProfileMenuOpen,
    handleProfileMenuClose,
  };
};
