import React from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { Today as TodayIcon } from '@mui/icons-material';
import type { CalendarFooterProps } from './types';

/**
 * CalendarFooter component
 * Handles footer actions (Today, Cancel)
 */
export const CalendarFooter: React.FC<CalendarFooterProps> = ({
  onGoToToday,
  onClose,
  isTodaySelectable,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mt: 2,
      pt: 1,
      borderTop: `1px solid ${theme.palette.divider}`
    }}>
      <Button
        size="small"
        startIcon={<TodayIcon />}
        onClick={onGoToToday}
        disabled={!isTodaySelectable}
      >
        Today
      </Button>
      
      <Button
        size="small"
        onClick={onClose}
      >
        Cancel
      </Button>
    </Box>
  );
};
