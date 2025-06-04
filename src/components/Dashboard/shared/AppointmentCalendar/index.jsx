import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getStatusColor } from '../../../../utils/dashboard/dashboardUtils';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

/**
 * AppointmentCalendar - Calendar view for appointments using react-big-calendar
 * 
 * Features:
 * - Role-based event rendering
 * - Responsive design with mobile optimization
 * - Custom event styling based on appointment status
 * - Click handlers for appointment interactions
 * - Material-UI theme integration
 */
const AppointmentCalendar = memo(({
  appointments = [],
  userRole,
  onSelectEvent,
  onSelectSlot,
  onNewAppointment,
  selectedDate = new Date(),
  view = 'month',
  onViewChange,
  onNavigate,
  showAddButton = true,
  height = 600,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Convert appointments to calendar events
  const events = useMemo(() => {
    return appointments.map(appointment => {
      // Handle both old and new API data structures
      const appointmentDate = appointment.appointmentDate || appointment.date;
      const serviceName = appointment.serviceName || appointment.serviceType || appointment.serviceId;
      const dentistName = appointment.dentistName;
      const patientName = appointment.patientName;

      const startDateTime = new Date(`${appointmentDate}T${appointment.startTime}`);
      const endDateTime = new Date(`${appointmentDate}T${appointment.endTime}`);

      // Determine title based on user role
      let title = '';
      switch (userRole) {
        case 'PATIENT':
          title = `${serviceName || 'Appointment'} - Dr. ${dentistName || 'Unknown'}`;
          break;
        case 'DENTIST':
          title = `${patientName || 'Unknown Patient'} - ${serviceName || 'Appointment'}`;
          break;
        case 'RECEPTIONIST':
        case 'CLINIC_ADMIN':
          title = `${patientName || 'Unknown'} with Dr. ${dentistName || 'Unknown'}`;
          break;
        default:
          title = serviceName || 'Appointment';
          break;
      }

      return {
        id: appointment.id,
        title,
        start: startDateTime,
        end: endDateTime,
        resource: appointment,
        status: appointment.status,
      };
    });
  }, [appointments, userRole]);

  // Custom event style getter
  const eventStyleGetter = useCallback((event) => {
    const statusColor = getStatusColor(event.status);
    
    return {
      style: {
        backgroundColor: statusColor,
        borderColor: statusColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: isMobile ? '12px' : '14px',
        padding: '2px 4px',
      },
    };
  }, [isMobile]);

  // Custom event component for better mobile display
  const EventComponent = useCallback(({ event }) => (
    <Box
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: isMobile ? '11px' : '13px',
        fontWeight: 'medium',
      }}
    >
      {event.title}
    </Box>
  ), [isMobile]);

  // Handle event selection
  const handleSelectEvent = useCallback((event) => {
    if (onSelectEvent) {
      onSelectEvent(event.resource);
    }
  }, [onSelectEvent]);

  // Handle slot selection (for creating new appointments)
  const handleSelectSlot = useCallback((slotInfo) => {
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    } else if (onNewAppointment) {
      onNewAppointment({
        date: moment(slotInfo.start).format('YYYY-MM-DD'),
        startTime: moment(slotInfo.start).format('HH:mm:ss'),
        endTime: moment(slotInfo.end).format('HH:mm:ss'),
      });
    }
  }, [onSelectSlot, onNewAppointment]);

  // Calendar messages for localization
  const messages = {
    allDay: 'All Day',
    previous: 'Previous',
    next: 'Next',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Time',
    event: 'Appointment',
    noEventsInRange: 'No appointments in this range.',
    showMore: total => `+${total} more`,
  };

  // Responsive view settings
  const defaultView = isMobile ? 'day' : view;
  const views = isMobile 
    ? ['day', 'agenda'] 
    : ['month', 'week', 'day', 'agenda'];

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          height: height,
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
            border: 'none',
          },
          '& .rbc-event:focus': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
          },
          '& .rbc-slot-selection': {
            backgroundColor: theme.palette.primary.light + '40',
          },
          '& .rbc-toolbar': {
            marginBottom: theme.spacing(2),
            flexWrap: 'wrap',
            gap: theme.spacing(1),
          },
          '& .rbc-toolbar button': {
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'transparent',
            padding: theme.spacing(0.5, 1),
            borderRadius: theme.shape.borderRadius,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.rbc-active': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          defaultView={defaultView}
          views={views}
          date={selectedDate}
          onNavigate={onNavigate}
          onView={onViewChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={!!onSelectSlot || !!onNewAppointment}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          messages={messages}
          popup
          step={15}
          timeslots={4}
          min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
          max={new Date(2024, 0, 1, 18, 0)} // 6:00 PM
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            dayHeaderFormat: isMobile ? 'ddd M/D' : 'dddd, MMMM D',
            monthHeaderFormat: 'MMMM YYYY',
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format('MMM D')} - ${moment(end).format('MMM D, YYYY')}`,
          }}
        />
      </Paper>

      {/* Floating Action Button for New Appointment */}
      {showAddButton && onNewAppointment && (
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
      )}
    </Box>
  );
});

AppointmentCalendar.propTypes = {
  /** Array of appointment objects */
  appointments: PropTypes.array,
  /** User role for event display customization */
  userRole: PropTypes.oneOf(['PATIENT', 'DENTIST', 'RECEPTIONIST', 'CLINIC_ADMIN']).isRequired,
  /** Callback when an event is selected */
  onSelectEvent: PropTypes.func,
  /** Callback when a time slot is selected */
  onSelectSlot: PropTypes.func,
  /** Callback for creating new appointment */
  onNewAppointment: PropTypes.func,
  /** Currently selected date */
  selectedDate: PropTypes.instanceOf(Date),
  /** Current calendar view */
  view: PropTypes.oneOf(['month', 'week', 'day', 'agenda']),
  /** Callback when view changes */
  onViewChange: PropTypes.func,
  /** Callback when date navigation occurs */
  onNavigate: PropTypes.func,
  /** Whether to show the add appointment button */
  showAddButton: PropTypes.bool,
  /** Calendar height in pixels */
  height: PropTypes.number,
};

AppointmentCalendar.displayName = 'AppointmentCalendar';

export default AppointmentCalendar;
