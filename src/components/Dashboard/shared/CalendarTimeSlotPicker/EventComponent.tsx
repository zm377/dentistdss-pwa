import React from 'react';
import { Box } from '@mui/material';
import type { EventComponentProps } from './types';

/**
 * Custom event component for calendar slots
 * Simplified event display logic
 */
export const EventComponent: React.FC<EventComponentProps> = ({ event }) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'medium',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.8,
      }
    }}
  >
    {event.title}
  </Box>
);
