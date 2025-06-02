import { useState, useCallback } from 'react';
import { useAuth } from '../../context/auth';
import api from '../../services';
import useConfirmationDialog from '../dashboard/useConfirmationDialog';

/**
 * Custom hook for appointment CRUD operations
 * 
 * Features:
 * - Reschedule appointments
 * - Cancel appointments
 * - Mark as no-show/complete
 * - Confirm appointments
 * - Role-based permission checking
 * - Integrated confirmation dialogs
 */
const useAppointmentActions = (onAppointmentUpdate) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const confirmationDialog = useConfirmationDialog();

  /**
   * Check if user has permission to modify an appointment
   */
  const hasPermission = useCallback((appointment, action) => {
    if (!currentUser || !appointment) return false;

    const userRole = currentUser.role;
    const isOwner = appointment.patientId === currentUser.id;
    const isAssignedDentist = appointment.dentistId === currentUser.id;
    const isClinicStaff = (userRole === 'RECEPTIONIST' || userRole === 'CLINIC_ADMIN') && 
                         appointment.clinicId === currentUser.clinicId;

    switch (action) {
      case 'reschedule':
      case 'cancel':
        return isOwner || isAssignedDentist || isClinicStaff;
      
      case 'confirm':
      case 'no-show':
      case 'complete':
        return isAssignedDentist || isClinicStaff;
      
      default:
        return false;
    }
  }, [currentUser]);

  /**
   * Reschedule an appointment
   */
  const rescheduleAppointment = useCallback(async (appointment, newDate, newStartTime, newEndTime) => {
    if (!hasPermission(appointment, 'reschedule')) {
      confirmationDialog.showError({
        title: 'Permission Denied',
        message: 'You do not have permission to reschedule this appointment.'
      });
      return false;
    }

    setLoading(true);
    try {
      const updatedAppointment = await api.appointment.rescheduleAppointment(
        appointment.id,
        newDate,
        newStartTime,
        newEndTime,
        currentUser.id
      );

      if (onAppointmentUpdate) {
        onAppointmentUpdate(appointment.id, updatedAppointment);
      }

      confirmationDialog.showSuccess({
        title: 'Appointment Rescheduled',
        message: 'The appointment has been successfully rescheduled.'
      });

      return true;
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      confirmationDialog.showError({
        title: 'Reschedule Failed',
        message: 'Failed to reschedule the appointment. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, currentUser, onAppointmentUpdate, confirmationDialog]);

  /**
   * Cancel an appointment
   */
  const cancelAppointment = useCallback(async (appointment, reason = '') => {
    if (!hasPermission(appointment, 'cancel')) {
      confirmationDialog.showError({
        title: 'Permission Denied',
        message: 'You do not have permission to cancel this appointment.'
      });
      return false;
    }

    setLoading(true);
    try {
      const updatedAppointment = await api.appointment.cancelAppointment(
        appointment.id,
        reason,
        currentUser.id
      );

      if (onAppointmentUpdate) {
        onAppointmentUpdate(appointment.id, updatedAppointment);
      }

      confirmationDialog.showSuccess({
        title: 'Appointment Cancelled',
        message: 'The appointment has been successfully cancelled.'
      });

      return true;
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      confirmationDialog.showError({
        title: 'Cancellation Failed',
        message: 'Failed to cancel the appointment. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, currentUser, onAppointmentUpdate, confirmationDialog]);

  /**
   * Confirm an appointment
   */
  const confirmAppointment = useCallback(async (appointment) => {
    if (!hasPermission(appointment, 'confirm')) {
      confirmationDialog.showError({
        title: 'Permission Denied',
        message: 'You do not have permission to confirm this appointment.'
      });
      return false;
    }

    setLoading(true);
    try {
      const updatedAppointment = await api.appointment.confirmAppointment(
        appointment.id,
        currentUser.id
      );

      if (onAppointmentUpdate) {
        onAppointmentUpdate(appointment.id, updatedAppointment);
      }

      confirmationDialog.showSuccess({
        title: 'Appointment Confirmed',
        message: 'The appointment has been confirmed.'
      });

      return true;
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      confirmationDialog.showError({
        title: 'Confirmation Failed',
        message: 'Failed to confirm the appointment. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, currentUser, onAppointmentUpdate, confirmationDialog]);

  /**
   * Mark appointment as no-show
   */
  const markNoShow = useCallback(async (appointment) => {
    if (!hasPermission(appointment, 'no-show')) {
      confirmationDialog.showError({
        title: 'Permission Denied',
        message: 'You do not have permission to mark this appointment as no-show.'
      });
      return false;
    }

    setLoading(true);
    try {
      const updatedAppointment = await api.appointment.markNoShow(appointment.id);

      if (onAppointmentUpdate) {
        onAppointmentUpdate(appointment.id, updatedAppointment);
      }

      confirmationDialog.showInfo({
        title: 'Marked as No-Show',
        message: 'The appointment has been marked as no-show.'
      });

      return true;
    } catch (error) {
      console.error('Failed to mark appointment as no-show:', error);
      confirmationDialog.showError({
        title: 'Update Failed',
        message: 'Failed to mark the appointment as no-show. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, onAppointmentUpdate, confirmationDialog]);

  /**
   * Mark appointment as complete
   */
  const completeAppointment = useCallback(async (appointment) => {
    if (!hasPermission(appointment, 'complete')) {
      confirmationDialog.showError({
        title: 'Permission Denied',
        message: 'You do not have permission to mark this appointment as complete.'
      });
      return false;
    }

    setLoading(true);
    try {
      const updatedAppointment = await api.appointment.completeAppointment(appointment.id);

      if (onAppointmentUpdate) {
        onAppointmentUpdate(appointment.id, updatedAppointment);
      }

      confirmationDialog.showSuccess({
        title: 'Appointment Completed',
        message: 'The appointment has been marked as complete.'
      });

      return true;
    } catch (error) {
      console.error('Failed to complete appointment:', error);
      confirmationDialog.showError({
        title: 'Update Failed',
        message: 'Failed to mark the appointment as complete. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [hasPermission, onAppointmentUpdate, confirmationDialog]);

  return {
    // State
    loading,
    
    // Actions
    rescheduleAppointment,
    cancelAppointment,
    confirmAppointment,
    markNoShow,
    completeAppointment,
    
    // Utilities
    hasPermission,
    
    // Dialog
    confirmationDialog: confirmationDialog.dialogProps,
    showConfirmationDialog: confirmationDialog.showDialog,
  };
};

export default useAppointmentActions;
