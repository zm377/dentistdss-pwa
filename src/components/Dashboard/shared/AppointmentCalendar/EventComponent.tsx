import React from 'react';
import { Box } from '@mui/material';
import type { EventComponentProps } from './types';

/**
 * Custom event component for better mobile display
 * Simplified event display logic
 */
export const EventComponent: React.FC<EventComponentProps> = ({ event }) => (
  <Box
    sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: { xs: '11px', md: '13px' },
      fontWeight: 'medium',
    }}
  >
    {event.title}
  </Box>
);
