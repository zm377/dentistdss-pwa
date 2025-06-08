import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';
import type { CalendarHeaderProps } from './types';

/**
 * CalendarHeader component
 * Handles month navigation and display
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  calendarDate,
  onNavigateMonth,
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: 2 
    }}>
      <IconButton 
        size="small" 
        onClick={() => onNavigateMonth(-1)}
        aria-label="Previous month"
      >
        <PrevIcon />
      </IconButton>
      
      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
        {calendarDate.format('MMMM YYYY')}
      </Typography>
      
      <IconButton 
        size="small" 
        onClick={() => onNavigateMonth(1)}
        aria-label="Next month"
      >
        <NextIcon />
      </IconButton>
    </Box>
  );
};
