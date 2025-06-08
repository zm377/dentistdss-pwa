import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { NewAppointmentData } from './types';

interface AddAppointmentFabProps {
  onNewAppointment: (data?: NewAppointmentData) => void;
  showAddButton: boolean;
}

/**
 * Floating Action Button for New Appointment
 * Simplified FAB component logic
 */
export const AddAppointmentFab: React.FC<AddAppointmentFabProps> = ({
  onNewAppointment,
  showAddButton,
}) => {
  if (!showAddButton) return null;

  return (
    <Tooltip title="Book New Appointment">
      <Fab
        color="primary"
        aria-label="book new appointment"
        onClick={() => onNewAppointment()}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};
