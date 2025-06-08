import { useState, useCallback } from 'react';
import api from '../../services';
import type { Clinic, Dentist, TimeSlot } from '../../types/api';
import type { BookingErrors } from './useAppointmentBooking';

/**
 * Data loading utilities for appointment booking
 * Extracted to follow Single Responsibility Principle
 */

export interface UseAppointmentBookingDataReturn {
  // State
  clinics: Clinic[];
  dentists: Dentist[];
  availableSlots: TimeSlot[];
  loading: boolean;
  
  // Actions
  loadClinics: () => Promise<void>;
  loadDentists: (clinicId: string) => Promise<void>;
  loadAvailableSlots: (clinicId: string, dentistId: string, date: string, duration: number) => Promise<void>;
  
  // Error handling
  setDataError: (field: string, error: string) => void;
}

export const useAppointmentBookingData = (
  setErrors: (updater: (prev: BookingErrors) => BookingErrors) => void
): UseAppointmentBookingDataReturn => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const setDataError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [setErrors]);

  /**
   * Load available clinics
   */
  const loadClinics = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const clinicsData = await api.clinic.getClinics();
      setClinics(clinicsData || []);
    } catch (error: any) {
      console.error('Failed to load clinics:', error);
      setDataError('clinics', 'Failed to load clinics');
    } finally {
      setLoading(false);
    }
  }, [setDataError]);

  /**
   * Load dentists for selected clinic
   */
  const loadDentists = useCallback(async (clinicId: string): Promise<void> => {
    if (!clinicId) {
      setDentists([]);
      return;
    }

    setLoading(true);
    try {
      const dentistsData = await api.clinic.getClinicDentists(Number(clinicId));
      setDentists(dentistsData || []);
    } catch (error: any) {
      console.error('Failed to load dentists:', error);
      setDataError('dentists', 'Failed to load dentists');
      setDentists([]);
    } finally {
      setLoading(false);
    }
  }, [setDataError]);

  /**
   * Load available slots for selected clinic, dentist, and date
   */
  const loadAvailableSlots = useCallback(async (
    clinicId: string,
    dentistId: string,
    date: string,
    duration: number
  ): Promise<void> => {
    if (!clinicId || !dentistId || !date || !duration) {
      setAvailableSlots([]);
      return;
    }

    setLoading(true);
    try {
      const slots = await api.appointment.getAvailableSlots(
        Number(dentistId),
        Number(clinicId),
        date,
        duration
      );
      setAvailableSlots(slots || []);
    } catch (error: any) {
      console.error('Failed to load available slots:', error);
      setDataError('slots', 'Failed to load available time slots');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [setDataError]);

  return {
    // State
    clinics,
    dentists,
    availableSlots,
    loading,
    
    // Actions
    loadClinics,
    loadDentists,
    loadAvailableSlots,
    
    // Error handling
    setDataError,
  };
};
