import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/auth';
import api from '../services';
import { getCalendarViewRange, transformSlotsToEvents } from '../utils/calendarUtils';

/**
 * Custom hook for schedule management
 * Provides state management and API interactions for dentist availability
 */
export const useSchedule = () => {
  const { currentUser } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [calendarEvents, setCalendarEvents] = useState([]);

  /**
   * Format date to YYYY-MM-DD string
   */
  const formatDate = useCallback((date) => {
    return date.toISOString().split('T')[0];
  }, []);

  /**
   * Get date range for current month view
   */
  const getDateRange = useCallback((date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: formatDate(startOfMonth),
      endDate: formatDate(endOfMonth)
    };
  }, [formatDate]);

  /**
   * Get calendar view range for data loading
   */
  const getCalendarRange = useCallback((date, view = 'month') => {
    return getCalendarViewRange(date, view);
  }, []);

  /**
   * Transform availability data to calendar events
   */
  const transformToCalendarEvents = useCallback((availabilityData, viewStart, viewEnd) => {
    return transformSlotsToEvents(availabilityData, viewStart, viewEnd);
  }, []);

  /**
   * Load availability data for date range
   */
  const loadAvailability = useCallback(async (startDate, endDate) => {
    if (!currentUser?.id || !currentUser?.clinicId) {
      setError('User information not available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.clinic.getDentistAvailability(
        currentUser.id,
        startDate,
        endDate
      );

      // Assuming the API consistently returns an array of availability data
      setAvailability(Array.isArray(data) ? data : data?.dataObject || data?.data || []);
    } catch (err) {
      console.error('❌ Failed to load availability:', err);
      setError(err.message || 'Failed to load availability data');
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /**
   * Load availability for current selected date range
   */
  const refreshAvailability = useCallback(() => {
    const { startDate, endDate } = getDateRange(selectedDate);
    loadAvailability(startDate, endDate);
  }, [selectedDate, getDateRange, loadAvailability]);

  /**
   * Create new availability slot
   */
  const createAvailability = useCallback(async (availabilityData) => {
    if (!currentUser?.id || !currentUser?.clinicId) {
      throw new Error('User information not available');
    }

    setLoading(true);
    try {
      const newSlot = await api.clinic.createAvailability({
        ...availabilityData,
        dentistId: currentUser.id,
        clinicId: currentUser.clinicId
      });

      // Refresh availability data
      refreshAvailability();
      return newSlot;
    } catch (err) {
      console.error('Failed to create availability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser, refreshAvailability]);

  /**
   * Block availability slot
   */
  const blockSlot = useCallback(async (slotId, reason) => {
    setLoading(true);
    try {
      await api.clinic.blockAvailabilitySlot(slotId, reason);
      refreshAvailability();
    } catch (err) {
      console.error('Failed to block slot:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshAvailability]);

  /**
   * Unblock availability slot
   */
  const unblockSlot = useCallback(async (slotId) => {
    setLoading(true);
    try {
      await api.clinic.unblockAvailabilitySlot(slotId);
      refreshAvailability();
    } catch (err) {
      console.error('Failed to unblock slot:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshAvailability]);

  /**
   * Delete availability slot
   */
  const deleteSlot = useCallback(async (slotId) => {
    setLoading(true);
    try {
      await api.clinic.deleteAvailabilitySlot(slotId);
      refreshAvailability();
    } catch (err) {
      console.error('Failed to delete slot:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshAvailability]);

  /**
   * Get availability slots for a specific date
   */
  const getSlotsForDate = useCallback((date) => {
    const dateStr = formatDate(date);
    const dateDayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    if (!availability || availability.length === 0) {
      return [];
    }

    const filteredSlots = availability.filter(slot => {
      // Validate slot data and ensure dayOfWeek is consistently 0-6
      if (!slot || typeof slot !== 'object' || typeof slot.dayOfWeek !== 'number' || slot.dayOfWeek < 0 || slot.dayOfWeek > 6) {
        // If dayOfWeek is 7 (ISO Sunday), convert to 0 for consistency
        if (slot?.dayOfWeek === 7) {
          slot.dayOfWeek = 0;
        } else {
          return false;
        }
      }

      if (slot.isRecurring) {
        // For recurring slots, check if the date falls within the effective range
        // and matches the day of week
        const slotDayOfWeek = slot.dayOfWeek;

        // Parse dates safely and consistently
        let effectiveFrom, effectiveUntil;
        try {
          effectiveFrom = new Date(slot.effectiveFrom.split('T')[0] + 'T00:00:00');
          effectiveUntil = new Date(slot.effectiveUntil.split('T')[0] + 'T23:59:59');
        } catch (error) {
          console.error('❌ Date parsing error for slot:', slot, error);
          return false;
        }

        // Normalize the target date to start of day for comparison
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const dayMatches = slotDayOfWeek === dateDayOfWeek;
        const dateInRange = targetDate >= effectiveFrom && targetDate <= effectiveUntil;

        return dayMatches && dateInRange;
      } else {
        // For one-time slots, check exact date match
        return slot.effectiveFrom === dateStr;
      }
    });

    return filteredSlots;
  }, [availability, formatDate]);

  /**
   * Change selected date and load new data if needed
   */
  const changeSelectedDate = useCallback((newDate) => {
    const currentRange = getDateRange(selectedDate);
    const newRange = getDateRange(newDate);

    setSelectedDate(newDate);

    // Load new data if the month changed
    if (currentRange.startDate !== newRange.startDate) {
      loadAvailability(newRange.startDate, newRange.endDate);
    }
  }, [selectedDate, getDateRange, loadAvailability]);

  // Update calendar events when availability data changes
  useEffect(() => {
    if (availability.length > 0) {
      const { startDateTime, endDateTime } = getCalendarRange(selectedDate, calendarView);
      const events = transformToCalendarEvents(availability, startDateTime, endDateTime);
      setCalendarEvents(events);
    } else {
      setCalendarEvents([]);
    }
  }, [availability, selectedDate, calendarView, getCalendarRange, transformToCalendarEvents]);

  // Load initial data when component mounts or user changes
  useEffect(() => {
    if (currentUser?.id && currentUser?.clinicId) {
      const { startDate, endDate } = getDateRange(selectedDate);
      loadAvailability(startDate, endDate);
    }
  }, [currentUser?.id, currentUser?.clinicId, selectedDate, getDateRange, loadAvailability]);

  return {
    // State
    availability,
    loading,
    error,
    selectedDate,
    calendarView,
    calendarEvents,

    // Actions
    createAvailability,
    blockSlot,
    unblockSlot,
    deleteSlot,
    refreshAvailability,
    changeSelectedDate,
    setCalendarView,

    // Computed values
    getSlotsForDate,
    getCalendarRange,
    transformToCalendarEvents,

    // Utilities
    formatDate
  };
};

export default useSchedule;
