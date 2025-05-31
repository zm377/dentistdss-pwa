import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Schedule.css';

import useSchedule from '../../../hooks/useSchedule';
import AddAvailabilityDialog from './components/AddAvailabilityDialog';
import BlockSlotDialog from './components/BlockSlotDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import CalendarEvent from './components/CalendarEvent';
import { createEventStyleGetter } from '../../../utils/calendarUtils';

/**
 * Schedule Management Page for Dentists
 *
 * Features:
 * - Calendar view of availability slots
 * - Add new availability slots
 * - Block/unblock existing slots
 * - Delete slots with confirmation
 * - Responsive design
 */
const SchedulePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    loading,
    error,
    selectedDate,
    calendarView,
    calendarEvents,
    createAvailability,
    blockSlot,
    unblockSlot,
    deleteSlot,
    changeSelectedDate,
    setCalendarView,
    getSlotsForDate
  } = useSchedule();

  // Initialize calendar localizer
  const localizer = momentLocalizer(moment);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Menu state for slot actions
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuSlot, setMenuSlot] = useState(null);

  // Calendar event style getter
  const eventStyleGetter = createEventStyleGetter();



  /**
   * Handle calendar event click (availability slot)
   */
  const handleEventSelect = (event) => {
    const slot = event.resource;
    setMenuSlot(slot);
    setMenuAnchorEl(document.body);
  };

  /**
   * Handle calendar slot selection (empty time slot)
   */
  const handleSlotSelect = (_slotInfo) => {
    setAddDialogOpen(true);
    // You can enhance this to pre-fill the dialog with the selected time
  };

  /**
   * Handle calendar navigation
   */
  const handleNavigate = (newDate, _view, _action) => {
    changeSelectedDate(newDate);
  };

  /**
   * Handle view change
   */
  const handleViewChange = (view) => {
    setCalendarView(view);
  };

  /**
   * Handle slot click to show action menu (legacy for chip clicks)
   */
  const handleSlotClick = (event, slot) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuSlot(slot);
  };

  /**
   * Close action menu
   */
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuSlot(null);
  };

  /**
   * Handle block slot action
   */
  const handleBlockSlot = () => {
    setSelectedSlot(menuSlot);
    setBlockDialogOpen(true);
    handleMenuClose();
  };

  /**
   * Handle unblock slot action
   */
  const handleUnblockSlot = async () => {
    try {
      await unblockSlot(menuSlot.id);
    } catch (err) {
      console.error('Failed to unblock slot:', err);
    }
    handleMenuClose();
  };

  /**
   * Handle delete slot action
   */
  const handleDeleteSlot = () => {
    setSelectedSlot(menuSlot);
    setConfirmDeleteOpen(true);
    handleMenuClose();
  };

  /**
   * Confirm delete slot
   */
  const confirmDelete = async () => {
    try {
      await deleteSlot(selectedSlot.id);
      setConfirmDeleteOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Failed to delete slot:', err);
    }
  };

  /**
   * Handle add availability
   */
  const handleAddAvailability = async (availabilityData) => {
    try {
      await createAvailability(availabilityData);
      setAddDialogOpen(false);
    } catch (err) {
      console.error('Failed to create availability:', err);
      throw err;
    }
  };

  /**
   * Handle block slot with reason
   */
  const handleBlockSlotWithReason = async (reason) => {
    try {
      await blockSlot(selectedSlot.id, reason);
      setBlockDialogOpen(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Failed to block slot:', err);
      throw err;
    }
  };

  /**
   * Get slot status color
   */
  const getSlotStatusColor = (slot) => {
    if (slot.isBlocked) return 'error';
    if (slot.isActive) return 'success';
    return 'default';
  };



  /**
   * Format time for display
   */
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  /**
   * Navigate to previous month
   */
  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    changeSelectedDate(newDate);
  };

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    changeSelectedDate(newDate);
  };

  /**
   * Render availability slots for a specific date
   */
  const renderSlotsForDate = (date) => {
    const slots = getSlotsForDate(date);

    if (slots.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="caption" color="text.secondary">
            No availability slots
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Click "Add Availability" to create new slots
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Available Slots ({slots.length})
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {slots.map((slot) => (
            <Chip
              key={slot.id}
              label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
              color={getSlotStatusColor(slot)}
              size="small"
              onClick={(e) => handleSlotClick(e, slot)}
              sx={{
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            />
          ))}
        </Box>

        {/* Legend */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip size="small" color="success" label="" sx={{ width: 16, height: 16, minWidth: 16 }} />
            <Typography variant="caption">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip size="small" color="error" label="" sx={{ width: 16, height: 16, minWidth: 16 }} />
            <Typography variant="caption">Blocked</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip size="small" color="default" label="" sx={{ width: 16, height: 16, minWidth: 16 }} />
            <Typography variant="caption">Inactive</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant="h4" component="h1">
            Schedule Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            disabled={loading}
          >
            Add Availability
          </Button>
        </Box>

        {/* Calendar Navigation */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          gap: 2
        }}>
          <IconButton onClick={handlePreviousMonth} disabled={loading}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">
            {selectedDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </Typography>
          <IconButton onClick={handleNextMonth} disabled={loading}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Calendar Grid */}
        <Grid container spacing={2}>
          {/* Calendar Component */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ height: isMobile ? 400 : 600 }}>
                  <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    onSelectEvent={handleEventSelect}
                    onSelectSlot={handleSlotSelect}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    view={isMobile ? 'day' : calendarView}
                    date={selectedDate}
                    selectable
                    popup
                    eventPropGetter={eventStyleGetter}
                    components={{
                      event: CalendarEvent
                    }}
                    views={isMobile ? ['day', 'agenda'] : ['month', 'week', 'day']}
                    step={30}
                    timeslots={2}
                    min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
                    max={new Date(2024, 0, 1, 20, 0)} // 8:00 PM
                    formats={{
                      timeGutterFormat: 'h:mm A',
                      eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                        localizer.format(start, 'h:mm A', culture) + ' - ' +
                        localizer.format(end, 'h:mm A', culture)
                    }}
                    className={loading ? 'calendar-loading' : ''}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Selected Date Details */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {renderSlotsForDate(selectedDate)}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Slot Action Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
        >
          {menuSlot?.isBlocked ? (
            <MenuItem onClick={handleUnblockSlot}>
              <ListItemIcon>
                <UnblockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Unblock</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleBlockSlot}>
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Block</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={handleDeleteSlot}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* Dialogs */}
        <AddAvailabilityDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSubmit={handleAddAvailability}
          loading={loading}
        />

        <BlockSlotDialog
          open={blockDialogOpen}
          onClose={() => setBlockDialogOpen(false)}
          onSubmit={handleBlockSlotWithReason}
          slot={selectedSlot}
          loading={loading}
        />

        <ConfirmationDialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Availability Slot"
          message={`Are you sure you want to delete this availability slot? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          showCancel={true}
          type="error"
        />
    </Box>
  );
};

export default SchedulePage;
