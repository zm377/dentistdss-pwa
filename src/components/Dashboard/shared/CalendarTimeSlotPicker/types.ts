/**
 * CalendarTimeSlotPicker types
 * Extracted to follow Single Responsibility Principle
 */

export interface AvailabilitySlot {
  id: string | number;
  dentistId: string | number;
  startTime: string;
  endTime: string;
  effectiveFrom: string;
  isActive: boolean;
  isBlocked: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    id: string | number;
    dentistId: string | number;
    date: string;
    slotStart: string;
    slotEnd: string;
    isAvailable: boolean;
  };
}

export interface CalendarTimeSlotPickerProps {
  dentistId?: string | number;
  selectedTime?: string;
  onSelectTime?: (startTime: string, endTime: string, date: string) => void;
  loading?: boolean;
  error?: string | null;
}

export interface EventStyleGetterParams {
  event: CalendarEvent;
  start: Date;
  end: Date;
  isSelected: boolean;
}

export interface EventComponentProps {
  event: CalendarEvent;
}
