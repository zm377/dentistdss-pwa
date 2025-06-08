import { useState, useCallback } from 'react';
import moment from 'moment';
import { getInitialCalendarDate, isDateSelectable, handleDateSelection } from './utils';

/**
 * Custom hook for calendar state management
 * Extracted to follow Single Responsibility Principle
 */
export const useCalendarState = (
  value?: Date | null,
  minDate?: Date | null,
  maxDate?: Date | null,
  onChange?: (date: Date | null) => void
) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [calendarDate, setCalendarDate] = useState(() => 
    getInitialCalendarDate(value, minDate)
  );

  const open = Boolean(anchorEl);

  // Handle text field click
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  // Handle popover close
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    const success = handleDateSelection(date, minDate, maxDate, onChange);
    if (success) {
      handleClose();
    }
  }, [onChange, minDate, maxDate, handleClose]);

  // Navigate calendar month
  const navigateMonth = useCallback((direction: number) => {
    setCalendarDate(prev => prev.clone().add(direction, 'month'));
  }, []);

  // Go to today
  const goToToday = useCallback(() => {
    const today = moment();
    setCalendarDate(today);
    
    // If today is within constraints, select it
    if (isDateSelectable(today.toDate(), minDate, maxDate)) {
      handleDateSelect(today.toDate());
    }
  }, [minDate, maxDate, handleDateSelect]);

  // Check if today is selectable
  const isTodaySelectable = isDateSelectable(moment().toDate(), minDate, maxDate);

  return {
    anchorEl,
    open,
    calendarDate,
    handleClick,
    handleClose,
    handleDateSelect,
    navigateMonth,
    goToToday,
    isTodaySelectable,
  };
};
