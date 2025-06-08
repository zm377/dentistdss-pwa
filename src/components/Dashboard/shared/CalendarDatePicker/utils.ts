import moment from 'moment';

/**
 * CalendarDatePicker utility functions
 * Extracted to follow Single Responsibility Principle
 */

/**
 * Format date for display
 */
export const formatDate = (date?: Date | null): string => {
  if (!date) return '';
  return moment(date).format('MMM D, YYYY');
};

/**
 * Check if date is selectable based on constraints
 */
export const isDateSelectable = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null
): boolean => {
  const momentDate = moment(date);
  if (minDate && momentDate.isBefore(moment(minDate), 'day')) return false;
  if (maxDate && momentDate.isAfter(moment(maxDate), 'day')) return false;
  return true;
};

/**
 * Check if date is selected
 */
export const isDateSelected = (date: Date, value?: Date | null): boolean => {
  if (!value) return false;
  return moment(date).isSame(moment(value), 'day');
};

/**
 * Generate calendar days for a given month
 */
export const generateCalendarDays = (calendarDate: moment.Moment): moment.Moment[] => {
  const startOfMonth = calendarDate.clone().startOf('month');
  const endOfMonth = calendarDate.clone().endOf('month');
  const startOfCalendar = startOfMonth.clone().startOf('week');
  const endOfCalendar = endOfMonth.clone().endOf('week');
  
  const days: moment.Moment[] = [];
  const current = startOfCalendar.clone();
  
  while (current.isSameOrBefore(endOfCalendar, 'day')) {
    days.push(current.clone());
    current.add(1, 'day');
  }
  
  return days;
};

/**
 * Get initial calendar date
 */
export const getInitialCalendarDate = (
  value?: Date | null,
  minDate?: Date | null
): moment.Moment => {
  if (value) return moment(value);
  if (minDate && moment().isBefore(moment(minDate))) return moment(minDate);
  return moment();
};

/**
 * Validate and handle date selection
 */
export const handleDateSelection = (
  date: Date,
  minDate?: Date | null,
  maxDate?: Date | null,
  onChange?: (date: Date | null) => void
): boolean => {
  if (!isDateSelectable(date, minDate, maxDate)) return false;
  
  onChange?.(date);
  return true;
};

/**
 * Week day labels
 */
export const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
