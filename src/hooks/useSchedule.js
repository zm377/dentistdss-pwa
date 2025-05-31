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

      // Handle different response formats
      let processedData = [];
      if (Array.isArray(data)) {
        processedData = data;
      } else if (data && Array.isArray(data.dataObject)) {
        processedData = data.dataObject;
      } else if (data && data.data && Array.isArray(data.data)) {
        processedData = data.data;
      } else {
        processedData = [];
      }

      setAvailability(processedData);
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
      // Validate slot data
      if (!slot || typeof slot !== 'object') {
        return false;
      }

      if (slot.isRecurring) {
        // For recurring slots, check if the date falls within the effective range
        // and matches the day of week
        const slotDayOfWeek = slot.dayOfWeek;

        // Handle different day of week formats
        // API might use 0-6 (JS standard) or 1-7 (ISO standard)
        let normalizedSlotDay = slotDayOfWeek;
        let normalizedTargetDay = dateDayOfWeek;

        // Handle different day of week formats more robustly
        if (typeof slotDayOfWeek === 'number') {
          if (slotDayOfWeek >= 1 && slotDayOfWeek <= 7) {
            // Check if this looks like ISO format (1=Monday, 7=Sunday)
            // We can detect this by checking if we have slots with dayOfWeek=7
            const hasSevenDay = availability.some(s => s.dayOfWeek === 7);
            const hasZeroDay = availability.some(s => s.dayOfWeek === 0);

            if (hasSevenDay && !hasZeroDay) {
              // Likely ISO format (1=Monday, 7=Sunday) - convert to JS format
              normalizedSlotDay = slotDayOfWeek === 7 ? 0 : slotDayOfWeek;
            } else if (slotDayOfWeek >= 0 && slotDayOfWeek <= 6) {
              // Already in JS format (0=Sunday, 6=Saturday)
              normalizedSlotDay = slotDayOfWeek;
            } else {
              return false;
            }
          } else if (slotDayOfWeek >= 0 && slotDayOfWeek <= 6) {
            // JS format (0=Sunday, 6=Saturday)
            normalizedSlotDay = slotDayOfWeek;
          } else {
            return false;
          }
        } else {
          return false;
        }

        // Parse dates more safely
        let effectiveFrom, effectiveUntil;
        try {
          // Handle different date formats
          if (slot.effectiveFrom.includes('T')) {
            effectiveFrom = new Date(slot.effectiveFrom);
          } else {
            effectiveFrom = new Date(slot.effectiveFrom + 'T00:00:00');
          }

          if (slot.effectiveUntil.includes('T')) {
            effectiveUntil = new Date(slot.effectiveUntil);
          } else {
            effectiveUntil = new Date(slot.effectiveUntil + 'T23:59:59');
          }
        } catch (error) {
          console.error('❌ Date parsing error for slot:', slot, error);
          return false;
        }

        // Normalize the target date to start of day for comparison
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Normalize effective dates for comparison
        const effectiveFromNormalized = new Date(effectiveFrom);
        effectiveFromNormalized.setHours(0, 0, 0, 0);

        const effectiveUntilNormalized = new Date(effectiveUntil);
        effectiveUntilNormalized.setHours(23, 59, 59, 999);

        const dayMatches = normalizedSlotDay === normalizedTargetDay;
        const dateInRange = targetDate >= effectiveFromNormalized && targetDate <= effectiveUntilNormalized;

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
