import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '@mui/material';

/**
 * Custom hook for managing dark mode state with localStorage persistence
 * and system preference detection for the dental clinic assistant PWA.
 *
 * Features:
 * - Persists dark mode preference in localStorage
 * - Detects system color scheme preference as default
 * - Provides smooth transitions between themes
 * - Returns current state and toggle function
 * - Compatible with Material-UI theme system
 *
 * @returns {Object} Object containing:
 *   - darkMode: boolean - Current dark mode state
 *   - toggleDarkMode: function - Function to toggle dark mode
 *   - setDarkMode: function - Function to set dark mode directly
 */
const useDarkMode = () => {
    // Detect system preference for dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    // Initialize state from localStorage or system preference
    const [darkMode, setDarkModeState] = useState(() => {
        try {
            // Check if user has a saved preference
            const savedMode = localStorage.getItem('dentist-dss-dark-mode');
            if (savedMode !== null) {
                return JSON.parse(savedMode);
            }
            // Fall back to system preference
            return prefersDarkMode;
        } catch (error) {
            console.warn('Error reading dark mode preference from localStorage:', error);
            return prefersDarkMode;
        }
    });

    // Update localStorage whenever dark mode changes
    useEffect(() => {
        try {
            localStorage.setItem('dentist-dss-dark-mode', JSON.stringify(darkMode));
        } catch (error) {
            console.warn('Error saving dark mode preference to localStorage:', error);
        }
    }, [darkMode]);

    // Update dark mode when system preference changes (only if no user preference is saved)
    useEffect(() => {
        try {
            const savedMode = localStorage.getItem('dentist-dss-dark-mode');
            if (savedMode === null) {
                // No user preference saved, follow system preference
                setDarkModeState(prefersDarkMode);
            }
        } catch (error) {
            console.warn('Error checking localStorage for dark mode preference:', error);
        }
    }, [prefersDarkMode]);

    // Toggle function with smooth transition
    const toggleDarkMode = useCallback(() => {
        setDarkModeState(prevMode => {
            const newMode = !prevMode;

            // Add transition class to body for smooth theme switching
            if (typeof document !== 'undefined') {
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

                // Remove transition after animation completes
                setTimeout(() => {
                    document.body.style.transition = '';
                }, 300);
            }

            return newMode;
        });
    }, []);

    // Direct setter function for programmatic control
    const setDarkMode = useCallback((mode) => {
        if (typeof mode === 'boolean') {
            setDarkModeState(mode);
        } else {
            console.warn('setDarkMode expects a boolean value');
        }
    }, []);

    // Apply theme-related CSS custom properties for additional styling support
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const root = document.documentElement;

            if (darkMode) {
                root.style.setProperty('--theme-mode', 'dark');
                root.style.setProperty('--theme-background', '#121212');
                root.style.setProperty('--theme-surface', '#1e1e1e');
                root.style.setProperty('--theme-text-primary', '#ffffff');
                root.style.setProperty('--theme-text-secondary', '#b0bec5');
            } else {
                root.style.setProperty('--theme-mode', 'light');
                root.style.setProperty('--theme-background', '#f8fffe');
                root.style.setProperty('--theme-surface', '#ffffff');
                root.style.setProperty('--theme-text-primary', '#172b4d');
                root.style.setProperty('--theme-text-secondary', '#6b778c');
            }
        }
    }, [darkMode]);

    return {
        darkMode,
        toggleDarkMode,
        setDarkMode,
    };
};

export default useDarkMode;