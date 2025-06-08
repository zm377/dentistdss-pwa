import { useState, useCallback, useEffect } from 'react';
import api from '../../../../services';
import { getDateRange } from './utils';
import type { AvailabilitySlot } from './types';

/**
 * Custom hook for managing dentist availability
 * Extracted to follow Single Responsibility Principle
 */
export const useAvailability = (dentistId?: string | number) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load dentist availability for the current and next month
   */
  const loadAvailability = useCallback(async (navigationDate?: Date | null) => {
    if (!dentistId) {
      setAvailability([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange(navigationDate);

      console.log(`Loading availability for dentist ${dentistId} from ${startDate} to ${endDate}`);

      const availabilityData = await api.clinic.getDentistAvailability(
        Number(dentistId),
        startDate,
        endDate
      );

      console.log('Received availability data:', availabilityData);
      // Convert DentistAvailability to AvailabilitySlot format
      const convertedData = (availabilityData || []).map(item => ({
        id: item.id,
        startTime: item.startTime,
        endTime: item.endTime,
        effectiveFrom: item.effectiveFrom,
        effectiveUntil: item.effectiveUntil,
        isActive: true,
        isRecurring: item.isRecurring || false,
        dayOfWeek: item.dayOfWeek,
      }));
      setAvailability(convertedData.map(item => ({
        ...item,
        dentistId: (item as any).dentistId || 0,
        isBlocked: (item as any).isBlocked || false
      })));
    } catch (err: any) {
      console.error('Failed to load dentist availability:', err);
      setError('Failed to load available time slots');
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  }, [dentistId]);

  // Load availability when dentist changes
  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  return {
    availability,
    loading,
    error,
    loadAvailability,
  };
};
