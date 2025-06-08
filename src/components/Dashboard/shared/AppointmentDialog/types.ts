/**
 * AppointmentDialog types
 * Extracted to follow Single Responsibility Principle
 */

import type { Appointment as ApiAppointment } from '../../../../types/api';

// Re-export the API Appointment type for use in this module
export type Appointment = ApiAppointment;

export interface EditData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  symptoms: string;
  notes: string;
  urgency: string;
}

export interface ValidationErrors {
  date?: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export type DialogMode = 'view' | 'edit' | 'reschedule';

export interface AppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  mode?: DialogMode;
  userRole?: string;
  onSave?: (appointment: Appointment, editData: EditData) => void;
  onReschedule?: (appointment: Appointment, date: string, startTime: string, endTime: string) => void;
  onCancel?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
  onMarkNoShow?: (appointment: Appointment) => void;
  onComplete?: (appointment: Appointment) => void;
  loading?: boolean;
}
