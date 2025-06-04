import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../../../services';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

/**
 * CalendarTimeSlotPicker - Specialized calendar for appointment booking
 *
 * Features:
 * - Shows dentist availability in 30-minute slots
 * - Integrates with getDentistAvailability API
 * - Only allows booking of available time slots
 * - Material-UI theme integration
 * - Responsive design
 */
const CalendarTimeSlotPicker = memo(({
  dentistId,
  selectedTime,
  onSelectTime,
  loading: externalLoading = false,
  error: externalError = null,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load dentist availability for the current and next month
   */
  const loadAvailability = useCallback(async (navigationDate = null) => {
    if (!dentistId) {
      setAvailability([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get a broader date range to ensure we capture all available slots
      const baseDate = navigationDate ? moment(navigationDate) : moment('2025-06-01');
      const startDate = baseDate.clone().startOf('month').format('YYYY-MM-DD');
      const endDate = baseDate.clone().add(3, 'months').endOf('month').format('YYYY-MM-DD');

      console.log(`Loading availability for dentist ${dentistId} from ${startDate} to ${endDate}`);

      const availabilityData = await api.clinic.getDentistAvailability(
        dentistId,
        startDate,
        endDate
      );

      console.log('Received availability data:', availabilityData);
      setAvailability(availabilityData || []);
    } catch (err) {
      console.error('Failed to load dentist availability:', err);
      setError('Failed to load available time slots');
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  }, [dentistId]);

  /**
   * Convert availability data to calendar events
   */
  const events = useMemo(() => {
    if (!availability.length) return [];

    const calendarEvents = [];

    availability.forEach(slot => {
      // Skip inactive, blocked, or invalid time slots
      if (!slot.isActive || slot.isBlocked || slot.startTime === "00:00:00") {
        console.log('Skipping slot:', slot.id, 'isActive:', slot.isActive, 'isBlocked:', slot.isBlocked, 'startTime:', slot.startTime);
        return;
      }

      // Use effectiveFrom as the date for this slot
      const slotDate = slot.effectiveFrom;
      console.log('Processing slot:', slot.id, 'date:', slotDate, 'time:', slot.startTime, '-', slot.endTime);

      // Generate 30-minute time slots for each availability period
      const startTime = moment(`${slotDate} ${slot.startTime}`, 'YYYY-MM-DD HH:mm:ss');
      const endTime = moment(`${slotDate} ${slot.endTime}`, 'YYYY-MM-DD HH:mm:ss');

      // Validate the time range
      if (!startTime.isValid() || !endTime.isValid() || startTime.isSameOrAfter(endTime)) {
        console.warn('Invalid time range for slot:', slot);
        return;
      }

      let current = startTime.clone();
      while (current.isBefore(endTime)) {
        const slotEnd = current.clone().add(30, 'minutes');

        // Don't create slots that extend beyond the availability period
        if (slotEnd.isAfter(endTime)) break;

        calendarEvents.push({
          id: `${slot.id}-${current.format('HHmm')}`,
          title: current.format('HH:mm'),
          start: current.toDate(),
          end: slotEnd.toDate(),
          resource: {
            ...slot,
            date: slotDate, // Add the date to the resource
            slotStart: current.format('HH:mm:ss'),
            slotEnd: slotEnd.format('HH:mm:ss'),
            isAvailable: true,
          }
        });

        current.add(30, 'minutes');
      }
    });

    console.log('Generated calendar events:', calendarEvents.length, calendarEvents);
    return calendarEvents;
  }, [availability]);

  /**
   * Handle time slot selection
   */
  const handleSelectEvent = useCallback((event) => {
    const { resource } = event;
    if (resource.isAvailable && onSelectTime) {
      // Pass the date along with the time
      onSelectTime(resource.slotStart, resource.slotEnd, resource.date);
    }
  }, [onSelectTime]);

  /**
   * Handle date navigation
   */
  const handleNavigate = useCallback((date) => {
    // Load availability for the new date range when navigating
    loadAvailability(date);
  }, [loadAvailability]);

  /**
   * Custom event style getter
   */
  const eventStyleGetter = useCallback((event) => {
    const isSelected = selectedTime === event.resource.slotStart;
    
    return {
      style: {
        backgroundColor: isSelected 
          ? theme.palette.primary.main 
          : theme.palette.success.light,
        borderColor: isSelected 
          ? theme.palette.primary.dark 
          : theme.palette.success.main,
        color: theme.palette.common.white,
        border: `2px solid ${isSelected 
          ? theme.palette.primary.dark 
          : theme.palette.success.main}`,
        borderRadius: theme.shape.borderRadius,
        fontSize: '12px',
        fontWeight: isSelected ? 'bold' : 'normal',
        cursor: 'pointer',
        opacity: event.resource.isAvailable ? 1 : 0.5,
      }
    };
  }, [theme, selectedTime]);

  /**
   * Custom event component
   */
  const EventComponent = useCallback(({ event }) => (
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
  ), []);

  // Load availability when dentist or date changes
  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  if (externalLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (externalError || error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {externalError || error}
      </Alert>
    );
  }

  if (!dentistId) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Please select a dentist to view available time slots.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Available Time Slots
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a 30-minute time slot from the calendar below. Green slots are available for booking.
      </Typography>

      {/* Debug Info */}
      {availability.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Found {availability.length} availability slots, generated {events.length} time slots
        </Alert>
      )}

      {events.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No available time slots found for the selected period.
          {availability.length > 0 ? ' Check console for debugging info.' : ' Please try a different date or dentist.'}
        </Alert>
      ) : (
        <>
          {/* Selected time display */}
          {selectedTime && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`Selected: ${moment(selectedTime, 'HH:mm:ss').format('h:mm A')}`}
                color="primary"
                variant="filled"
              />
            </Box>
          )}

          {/* Calendar */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              height: isMobile ? 600 : 700,
              '& .rbc-calendar': {
                height: '100%',
              },
              // Custom styles for react-big-calendar
              '& .rbc-header': {
                backgroundColor: theme.palette.grey[50],
                borderBottom: `1px solid ${theme.palette.divider}`,
                padding: theme.spacing(1),
                fontWeight: 'medium',
              },
              '& .rbc-today': {
                backgroundColor: theme.palette.primary.light + '20',
              },
              '& .rbc-off-range-bg': {
                backgroundColor: theme.palette.grey[100],
              },
              '& .rbc-event': {
                borderRadius: theme.shape.borderRadius,
              },
              '& .rbc-event:focus': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '2px',
              },
              // Dark mode support
              ...(theme.palette.mode === 'dark' && {
                '& .rbc-header': {
                  backgroundColor: theme.palette.grey[800],
                  color: theme.palette.common.white,
                },
                '& .rbc-off-range-bg': {
                  backgroundColor: theme.palette.grey[900],
                },
                '& .rbc-today': {
                  backgroundColor: theme.palette.primary.dark + '30',
                },
              }),
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              defaultView="month"
              views={['month', 'week', 'day']}
              date={new Date(2025, 5, 1)} // Start from June 2025 to match your data
              onNavigate={handleNavigate}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
              }}
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
              max={new Date(2024, 0, 1, 18, 0)} // 6:00 PM
              formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) => 
                  `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                dayHeaderFormat: isMobile ? 'ddd M/D' : 'dddd, MMMM D',
                dayRangeHeaderFormat: ({ start, end }) =>
                  `${moment(start).format('MMM D')} - ${moment(end).format('MMM D, YYYY')}`,
              }}
              messages={{
                noEventsInRange: 'No available time slots in this range.',
                showMore: total => `+${total} more`,
              }}
            />
          </Paper>
        </>
      )}
    </Box>
  );
});

CalendarTimeSlotPicker.propTypes = {
  /** Dentist ID to fetch availability for */
  dentistId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Currently selected time in HH:mm:ss format */
  selectedTime: PropTypes.string,
  /** Callback when time slot is selected */
  onSelectTime: PropTypes.func,
  /** External loading state */
  loading: PropTypes.bool,
  /** External error message */
  error: PropTypes.string,
};

export default CalendarTimeSlotPicker;
