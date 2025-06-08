import { useCallback } from 'react';
import moment from 'moment';
import type { 
  Appointment, 
  SlotInfo, 
  NewAppointmentData,
  CalendarEvent 
} from './types';

/**
 * Custom hook for calendar event handling
 * Extracted to follow Single Responsibility Principle
 */
export const useCalendarEvents = (
  onSelectEvent?: (appointment: Appointment) => void,
  onSelectSlot?: (slotInfo: SlotInfo) => void,
  onNewAppointment?: (data?: NewAppointmentData) => void
) => {
  // Handle event selection
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    if (onSelectEvent) {
      onSelectEvent(event.resource);
    }
  }, [onSelectEvent]);

  // Handle slot selection (for creating new appointments)
  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    } else if (onNewAppointment) {
      onNewAppointment({
        date: moment(slotInfo.start).format('YYYY-MM-DD'),
        startTime: moment(slotInfo.start).format('HH:mm:ss'),
        endTime: moment(slotInfo.end).format('HH:mm:ss'),
      });
    }
  }, [onSelectSlot, onNewAppointment]);

  return {
    handleSelectEvent,
    handleSelectSlot,
  };
};
