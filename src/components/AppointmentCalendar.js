import React, {useState, useEffect} from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemSecondaryAction,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Today as TodayIcon,
} from '@mui/icons-material';

const AppointmentCalendar = ({
                               viewType = 'month', // 'day', 'week', 'month'
                               onAppointmentClick,
                               onNewAppointment,
                               userRole = 'patient' // 'patient', 'dentist', 'receptionist'
                             }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock appointment data
  const mockAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      dentistName: 'Dr. Smith',
      date: new Date(2024, 11, 15, 10, 0),
      duration: 60,
      type: 'Checkup',
      status: 'confirmed',
      notes: 'Regular checkup appointment'
    },
    {
      id: 2,
      patientName: 'Jane Wilson',
      dentistName: 'Dr. Johnson',
      date: new Date(2024, 11, 15, 14, 30),
      duration: 90,
      type: 'Root Canal',
      status: 'confirmed',
      notes: 'Follow-up root canal treatment'
    },
    {
      id: 3,
      patientName: 'Mike Brown',
      dentistName: 'Dr. Smith',
      date: new Date(2024, 11, 16, 9, 0),
      duration: 45,
      type: 'Cleaning',
      status: 'pending',
      notes: 'Routine dental cleaning'
    },
  ];

  useEffect(() => {
    loadAppointments();
  }, [currentDate]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    return appointments.filter(apt =>
        apt.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    const dayAppointments = getAppointmentsForDate(date);
    if (dayAppointments.length === 1) {
      setSelectedAppointment(dayAppointments[0]);
      setShowAppointmentDialog(true);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDialog(true);
    if (onAppointmentClick) {
      onAppointmentClick(appointment);
    }
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <Box>
          {/* Week day headers */}
          <Grid container sx={{mb: 1}}>
            {weekDays.map(day => (
                <Grid item xs key={day}>
                  <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{py: 1, fontWeight: 'bold'}}
                  >
                    {day}
                  </Typography>
                </Grid>
            ))}
          </Grid>

          {/* Calendar grid */}
          <Grid container spacing={1}>
            {days.map((date, index) => {
              const dayAppointments = getAppointmentsForDate(date);
              const isToday = date && date.toDateString() === new Date().toDateString();
              const isSelected = date && date.toDateString() === selectedDate.toDateString();

              return (
                  <Grid item xs key={index}>
                    <Card
                        sx={{
                          minHeight: 100,
                          cursor: date ? 'pointer' : 'default',
                          bgcolor: isSelected ? 'primary.light' :
                              isToday ? 'secondary.light' :
                                  date ? 'background.paper' : 'action.hover',
                          opacity: date ? 1 : 0.3,
                          border: isToday ? 2 : 1,
                          borderColor: isToday ? 'primary.main' : 'divider',
                        }}
                        onClick={() => handleDateClick(date)}
                    >
                      <CardContent sx={{p: 1, '&:last-child': {pb: 1}}}>
                        {date && (
                            <>
                              <Typography variant="body2" sx={{fontWeight: 'bold'}}>
                                {date.getDate()}
                              </Typography>
                              {dayAppointments.map((apt, idx) => (
                                  <Chip
                                      key={idx}
                                      label={`${formatTime(apt.date)} ${apt.type}`}
                                      size="small"
                                      color={getStatusColor(apt.status)}
                                      sx={{
                                        fontSize: '0.7rem',
                                        height: 20,
                                        mb: 0.5,
                                        display: 'block',
                                        '& .MuiChip-label': {px: 1}
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAppointmentClick(apt);
                                      }}
                                  />
                              ))}
                              {dayAppointments.length > 2 && (
                                  <Typography variant="caption" color="text.secondary">
                                    +{dayAppointments.length - 2} more
                                  </Typography>
                              )}
                            </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
              );
            })}
          </Grid>
        </Box>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(selectedDate);
    const timeSlots = [];

    // Generate time slots from 8 AM to 6 PM
    for (let hour = 8; hour < 18; hour++) {
      timeSlots.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, 0));
      timeSlots.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, 30));
    }

    return (
        <Box>
          <Typography variant="h6" gutterBottom>
            {selectedDate.toLocaleDateString([], {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>

          <List>
            {timeSlots.map((timeSlot, index) => {
              const slotAppointment = dayAppointments.find(apt =>
                  apt.date.getHours() === timeSlot.getHours() &&
                  apt.date.getMinutes() === timeSlot.getMinutes()
              );

              return (
                  <ListItem
                      key={index}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: slotAppointment ? 'action.hover' : 'transparent'
                      }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ mb: 1 }}>
                        {formatTime(timeSlot)}
                      </Box>
                      {slotAppointment ? (
                          <Box>
                            <Typography variant="body2" fontWeight="medium" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                              {slotAppointment.patientName} - {slotAppointment.type}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                              <Chip
                                  label={slotAppointment.status}
                                  size="small"
                                  color={getStatusColor(slotAppointment.status)}
                              />
                            </Box>
                          </Box>
                      ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            Available
                          </Typography>
                      )}
                    </Box>
                    {slotAppointment && (
                        <ListItemSecondaryAction>
                          <IconButton
                              size="small"
                              onClick={() => handleAppointmentClick(slotAppointment)}
                          >
                            <EditIcon/>
                          </IconButton>
                        </ListItemSecondaryAction>
                    )}
                  </ListItem>
              );
            })}
          </List>
        </Box>
    );
  };

  return (
      <Paper elevation={1} sx={{p: 2}}>
        {/* Calendar Header */}
        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
          <IconButton onClick={() => navigateDate(-1)}>
            <ChevronLeftIcon/>
          </IconButton>

          <Typography variant="h5" sx={{flexGrow: 1, textAlign: 'center'}}>
            {viewType === 'month'
                ? currentDate.toLocaleDateString([], {month: 'long', year: 'numeric'})
                : currentDate.toLocaleDateString()
            }
          </Typography>

          <IconButton onClick={() => navigateDate(1)}>
            <ChevronRightIcon/>
          </IconButton>

          <Button
              startIcon={<TodayIcon/>}
              onClick={() => setCurrentDate(new Date())}
              sx={{ml: 2}}
          >
            Today
          </Button>

          {(userRole === 'dentist' || userRole === 'receptionist') && (
              <Button
                  variant="contained"
                  startIcon={<AddIcon/>}
                  onClick={onNewAppointment}
                  sx={{ml: 1}}
              >
                New Appointment
              </Button>
          )}
        </Box>

        {/* Calendar Content */}
        {viewType === 'month' ? renderMonthView() : renderDayView()}

        {/* Appointment Details Dialog */}
        <Dialog
            open={showAppointmentDialog}
            onClose={() => setShowAppointmentDialog(false)}
            maxWidth="sm"
            fullWidth
        >
          <DialogTitle>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <EventIcon/>
              Appointment Details
            </Box>
          </DialogTitle>

          {selectedAppointment && (
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                    <Typography variant="body1">{selectedAppointment.patientName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Dentist</Typography>
                    <Typography variant="body1">{selectedAppointment.dentistName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                    <Typography variant="body1">
                      {selectedAppointment.date.toLocaleDateString()} at {formatTime(selectedAppointment.date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1">{selectedAppointment.duration} minutes</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                    <Typography variant="body1">{selectedAppointment.type}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Chip
                        label={selectedAppointment.status}
                        color={getStatusColor(selectedAppointment.status)}
                        size="small"
                    />
                  </Grid>
                  {selectedAppointment.notes && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                        <Typography variant="body1">{selectedAppointment.notes}</Typography>
                      </Grid>
                  )}
                </Grid>
              </DialogContent>
          )}

          <DialogActions>
            <Button onClick={() => setShowAppointmentDialog(false)}>
              Close
            </Button>
            {(userRole === 'dentist' || userRole === 'receptionist') && (
                <>
                  <Button startIcon={<EditIcon/>}>
                    Edit
                  </Button>
                  <Button color="error" startIcon={<DeleteIcon/>}>
                    Cancel
                  </Button>
                </>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
  );
};

export default AppointmentCalendar;
