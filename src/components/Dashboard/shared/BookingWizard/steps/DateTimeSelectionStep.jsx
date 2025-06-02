import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import CalendarDatePicker from '../../CalendarDatePicker';

/**
 * DateTimeSelectionStep - Second step for date, time, and dentist selection
 */
const DateTimeSelectionStep = ({
  selectedClinic,
  selectedDate,
  selectedTime,
  selectedDentist,
  availableSlots,
  onSelectDate,
  onSelectTime,
  onSelectDentist,
  errors,
  loading,
}) => {
  if (!selectedClinic) {
    return (
      <Alert severity="info">
        Please select a clinic first.
      </Alert>
    );
  }

  // Mock dentists for now - in real implementation, this would come from API
  const dentists = [
    { id: '1', name: 'Dr. Smith', specialty: 'General Dentistry' },
    { id: '2', name: 'Dr. Johnson', specialty: 'Orthodontics' },
    { id: '3', name: 'Dr. Brown', specialty: 'Oral Surgery' },
  ];

  // Mock time slots for now
  const timeSlots = [
    '09:00:00', '09:30:00', '10:00:00', '10:30:00',
    '11:00:00', '11:30:00', '14:00:00', '14:30:00',
    '15:00:00', '15:30:00', '16:00:00', '16:30:00',
  ];

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Date, Time & Dentist
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose your preferred appointment date, time, and dentist.
      </Typography>

      <Grid container spacing={3}>
        {/* Date Selection */}
        <Grid item xs={12} md={6}>
          <CalendarDatePicker
            label="Appointment Date"
            value={selectedDate ? new Date(selectedDate) : null}
            onChange={(date) => onSelectDate(date?.toISOString().split('T')[0])}
            minDate={new Date()}
            fullWidth
            error={!!errors.date}
            helperText={errors.date || 'Select your preferred appointment date'}
            required
          />
        </Grid>

        {/* Dentist Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.dentistId}>
            <InputLabel>Preferred Dentist</InputLabel>
            <Select
              value={selectedDentist}
              label="Preferred Dentist"
              onChange={(e) => onSelectDentist(e.target.value)}
            >
              {dentists.map((dentist) => (
                <MenuItem key={dentist.id} value={dentist.id}>
                  {dentist.name} - {dentist.specialty}
                </MenuItem>
              ))}
            </Select>
            {errors.dentistId && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.dentistId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Time Slot Selection */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Available Time Slots
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {timeSlots.map((slot) => (
                <Chip
                  key={slot}
                  label={formatTime(slot)}
                  clickable
                  color={selectedTime === slot ? 'primary' : 'default'}
                  variant={selectedTime === slot ? 'filled' : 'outlined'}
                  onClick={() => {
                    onSelectTime(slot, slot); // In real implementation, calculate end time
                  }}
                />
              ))}
            </Box>
          )}
          
          {errors.startTime && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.startTime}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

DateTimeSelectionStep.propTypes = {
  selectedClinic: PropTypes.string,
  selectedDate: PropTypes.string,
  selectedTime: PropTypes.string,
  selectedDentist: PropTypes.string,
  availableSlots: PropTypes.array,
  onSelectDate: PropTypes.func.isRequired,
  onSelectTime: PropTypes.func.isRequired,
  onSelectDentist: PropTypes.func.isRequired,
  errors: PropTypes.object,
  loading: PropTypes.bool,
};

export default DateTimeSelectionStep;
