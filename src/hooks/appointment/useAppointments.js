import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/auth';
import api from '../../services';

/**
 * Custom hook for managing appointment data
 * 
 * Features:
 * - Role-based appointment fetching
 * - Real-time data updates
 * - Loading and error state management
 * - Automatic refresh on date changes
 */
const useAppointments = (selectedDate = null) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  // Get today's date in YYYY-MM-DD format if no date provided
  const getFormattedDate = useCallback((date) => {
    const targetDate = date || new Date();
    return targetDate.toISOString().split('T')[0];
  }, []);

  /**
   * Fetch appointments based on user role
   */
  const fetchAppointments = useCallback(async (date = null) => {
    if (!currentUser) return;

    setLoading(true);
    setError('');

    try {
      const formattedDate = getFormattedDate(date);
      let appointmentData = [];

      switch (currentUser.role) {
        case 'PATIENT':
          appointmentData = await api.appointment.getPatientAppointments(currentUser.id);
          break;

        case 'DENTIST':
          appointmentData = await api.appointment.getDentistAppointments(currentUser.id, formattedDate);
          break;

        case 'RECEPTIONIST':
        case 'CLINIC_ADMIN':
          if (currentUser.clinicId) {
            appointmentData = await api.appointment.getClinicAppointments(currentUser.clinicId, formattedDate);
          }
          break;

        default:
          console.warn('Unknown user role for appointments:', currentUser.role);
          break;
      }

      setAppointments(appointmentData || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser, getFormattedDate]);

  /**
   * Refresh appointments data
   */
  const refreshAppointments = useCallback((date = null) => {
    fetchAppointments(date);
  }, [fetchAppointments]);

  /**
   * Update a specific appointment in the local state
   */
  const updateAppointment = useCallback((appointmentId, updatedData) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, ...updatedData }
          : appointment
      )
    );
  }, []);

  /**
   * Remove an appointment from local state
   */
  const removeAppointment = useCallback((appointmentId) => {
    setAppointments(prev => 
      prev.filter(appointment => appointment.id !== appointmentId)
    );
  }, []);

  /**
   * Add a new appointment to local state
   */
  const addAppointment = useCallback((newAppointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  }, []);

  // Initial load and reload when selectedDate changes
  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [fetchAppointments, selectedDate]);

  // Filter appointments for today (for dashboard overview)
  const todaysAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return appointmentDate === today;
  });

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return appointmentDate >= today && appointmentDate <= nextWeek;
  });

  return {
    // Data
    appointments,
    todaysAppointments,
    upcomingAppointments,
    
    // State
    loading,
    error,
    
    // Actions
    refreshAppointments,
    updateAppointment,
    removeAppointment,
    addAppointment,
    
    // Utilities
    fetchAppointments,
  };
};

export default useAppointments;
