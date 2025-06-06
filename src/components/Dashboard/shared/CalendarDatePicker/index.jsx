import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Popover,
  Paper,
  IconButton,
  Typography,
  Grid,
  Button,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  Today as TodayIcon,
} from '@mui/icons-material';
import moment from 'moment';

/**
 * CalendarDatePicker - Custom date picker using moment.js (same as react-big-calendar)
 * 
 * Features:
 * - Uses moment.js for consistency with react-big-calendar
 * - Material-UI design integration
 * - Responsive calendar popup
 * - Min/max date constraints
 * - Keyboard navigation support
 */
const CalendarDatePicker = memo(({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = false,
  placeholder = 'Select date',
  ...textFieldProps
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [calendarDate, setCalendarDate] = useState(() => {
    if (value) return moment(value);
    if (minDate && moment().isBefore(moment(minDate))) return moment(minDate);
    return moment();
  });
  
  const theme = useTheme();
  const open = Boolean(anchorEl);

  // Format date for display
  const formatDate = useCallback((date) => {
    if (!date) return '';
    return moment(date).format('MMM D, YYYY');
  }, []);

  // Handle text field click
  const handleClick = useCallback((event) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  }, [disabled]);

  // Handle popover close
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Handle date selection
  const handleDateSelect = useCallback((date) => {
    const momentDate = moment(date);
    
    // Check constraints
    if (minDate && momentDate.isBefore(moment(minDate), 'day')) return;
    if (maxDate && momentDate.isAfter(moment(maxDate), 'day')) return;
    
    onChange(momentDate.toDate());
    handleClose();
  }, [onChange, minDate, maxDate, handleClose]);

  // Navigate calendar month
  const navigateMonth = useCallback((direction) => {
    setCalendarDate(prev => prev.clone().add(direction, 'month'));
  }, []);

  // Go to today
  const goToToday = useCallback(() => {
    const today = moment();
    setCalendarDate(today);
    
    // If today is within constraints, select it
    if ((!minDate || today.isSameOrAfter(moment(minDate), 'day')) &&
        (!maxDate || today.isSameOrBefore(moment(maxDate), 'day'))) {
      handleDateSelect(today.toDate());
    }
  }, [minDate, maxDate, handleDateSelect]);

  // Check if date is selectable
  const isDateSelectable = useCallback((date) => {
    const momentDate = moment(date);
    if (minDate && momentDate.isBefore(moment(minDate), 'day')) return false;
    if (maxDate && momentDate.isAfter(moment(maxDate), 'day')) return false;
    return true;
  }, [minDate, maxDate]);

  // Check if date is selected
  const isDateSelected = useCallback((date) => {
    if (!value) return false;
    return moment(date).isSame(moment(value), 'day');
  }, [value]);

  // Generate calendar days
  const generateCalendarDays = useCallback(() => {
    const startOfMonth = calendarDate.clone().startOf('month');
    const endOfMonth = calendarDate.clone().endOf('month');
    const startOfCalendar = startOfMonth.clone().startOf('week');
    const endOfCalendar = endOfMonth.clone().endOf('week');
    
    const days = [];
    const current = startOfCalendar.clone();
    
    while (current.isSameOrBefore(endOfCalendar, 'day')) {
      days.push(current.clone());
      current.add(1, 'day');
    }
    
    return days;
  }, [calendarDate]);

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <TextField
        {...textFieldProps}
        label={label}
        value={formatDate(value)}
        onClick={handleClick}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        placeholder={placeholder}
        InputProps={{
          readOnly: true,
          style: { cursor: disabled ? 'default' : 'pointer' },
        }}
      />
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2, minWidth: 300 }}>
          {/* Calendar Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}>
            <IconButton 
              size="small" 
              onClick={() => navigateMonth(-1)}
              aria-label="Previous month"
            >
              <PrevIcon />
            </IconButton>
            
            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
              {calendarDate.format('MMMM YYYY')}
            </Typography>
            
            <IconButton 
              size="small" 
              onClick={() => navigateMonth(1)}
              aria-label="Next month"
            >
              <NextIcon />
            </IconButton>
          </Box>

          {/* Weekday Headers */}
          <Grid container spacing={0} sx={{ mb: 1 }}>
            {weekDays.map((day) => (
              <Grid size={1} key={day}>
                <Box sx={{
                  textAlign: 'center',
                  py: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  color: 'text.secondary'
                }}>
                  {day}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container spacing={0}>
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.month() === calendarDate.month();
              const isToday = day.isSame(moment(), 'day');
              const isSelected = isDateSelected(day.toDate());
              const isSelectable = isDateSelectable(day.toDate());
              
              return (
                <Grid size={1} key={index}>
                  <Button
                    size="small"
                    onClick={() => handleDateSelect(day.toDate())}
                    disabled={!isSelectable}
                    sx={{
                      minWidth: 36,
                      height: 36,
                      p: 0,
                      borderRadius: 1,
                      color: isCurrentMonth ? 'text.primary' : 'text.disabled',
                      backgroundColor: isSelected ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                      },
                      '&.Mui-disabled': {
                        color: 'text.disabled',
                      },
                      ...(isToday && !isSelected && {
                        border: `1px solid ${theme.palette.primary.main}`,
                      }),
                      ...(isSelected && {
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }),
                    }}
                  >
                    {day.date()}
                  </Button>
                </Grid>
              );
            })}
          </Grid>

          {/* Footer Actions */}
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
              onClick={goToToday}
              disabled={!isDateSelectable(moment().toDate())}
            >
              Today
            </Button>
            
            <Button
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      </Popover>
    </>
  );
});

CalendarDatePicker.propTypes = {
  /** Field label */
  label: PropTypes.string,
  /** Selected date value */
  value: PropTypes.instanceOf(Date),
  /** Callback when date changes */
  onChange: PropTypes.func.isRequired,
  /** Minimum selectable date */
  minDate: PropTypes.instanceOf(Date),
  /** Maximum selectable date */
  maxDate: PropTypes.instanceOf(Date),
  /** Error state */
  error: PropTypes.bool,
  /** Helper text */
  helperText: PropTypes.string,
  /** Required field */
  required: PropTypes.bool,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** Full width */
  fullWidth: PropTypes.bool,
  /** Placeholder text */
  placeholder: PropTypes.string,
};

CalendarDatePicker.displayName = 'CalendarDatePicker';

export default CalendarDatePicker;
