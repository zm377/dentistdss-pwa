import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import CalendarTimeSlotPicker from '../../CalendarTimeSlotPicker';
import api from '../../../../../services';

interface Dentist {
  id: string | number;
  firstName: string;
  lastName: string;
  specialty?: string;
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface DateTimeSelectionStepProps {
  selectedClinic: string | number;
  selectedDate: string;
  selectedTime: string;
  selectedDentist: string | number;
  availableSlots: AvailableSlot[];
  onSelectDate: (date: string) => void;
  onSelectTime: (startTime: string, endTime: string) => void;
  onSelectDentist: (dentistId: string) => void;
  errors: ValidationErrors;
  loading: boolean;
}

/**
 * DateTimeSelectionStep - Second step for date, time, and dentist selection
 */
const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
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


  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [dentistsLoading, setDentistsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  /**
   * Load dentists for the selected clinic
   */
  useEffect(() => {
    const loadDentists = async () => {
      if (!selectedClinic) {
        setDentists([]);
        return;
      }

      setDentistsLoading(true);
      try {
        const dentistsData = await api.clinic.getClinicDentists(Number(selectedClinic));
        setDentists(dentistsData || []);
      } catch (error) {
        console.error('Failed to load dentists:', error);
        setDentists([]);
      } finally {
        setDentistsLoading(false);
      }
    };

    loadDentists();
  }, [selectedClinic]);

  if (!selectedClinic) {
    return (
      <Alert severity="info">
        Please select a clinic first.
      </Alert>
    );
  }

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Time & Dentist
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose your preferred dentist and appointment time. Each appointment slot is 30 minutes.
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Dentist Selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth error={!!errors.dentistId}>
            <InputLabel>Preferred Dentist</InputLabel>
            <Select
              value={selectedDentist || ''}
              label="Preferred Dentist"
              onChange={(e) => onSelectDentist(String(e.target.value))}
              disabled={dentistsLoading}
            >
              {dentistsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading dentists...
                </MenuItem>
              ) : dentists.length === 0 ? (
                <MenuItem disabled>No dentists available</MenuItem>
              ) : (
                dentists.map((dentist) => (
                  <MenuItem key={dentist.id} value={dentist.id}>
                    {dentist.firstName} {dentist.lastName} - {dentist.specialty || 'General Dentistry'}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.dentistId && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.dentistId}
              </Typography>
            )}
          </FormControl>
        </Box>

        {/* Time Slot Selection */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* View Mode Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs
              value={viewMode}
              onChange={(_, newValue) => setViewMode(newValue as 'calendar' | 'list')}
            >
              <Tab label="Choose Date" value="calendar" />
              <Tab label="select Time" value="list" />
            </Tabs>
          </Box>

          {viewMode === 'calendar' ? (
            <CalendarTimeSlotPicker
              dentistId={selectedDentist}
              selectedTime={selectedTime}
              onSelectTime={(startTime: string, endTime: string, date?: string) => {
                onSelectTime(startTime, endTime);
                // Auto-set the date based on the selected time slot
                if (date) {
                  onSelectDate(date);
                }
              }}
              loading={loading}
              error={errors.slots}
            />
          ) : (
            // List view for available slots
            <Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : availableSlots.length === 0 ? (
                <Alert severity="info">
                  {selectedDentist && selectedDate
                    ? 'No available time slots found for the selected date and dentist.'
                    : 'Please select a dentist and date to view available time slots.'
                  }
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableSlots.map((slot, index) => (
                    <Chip
                      key={index}
                      label={formatTime(slot.startTime)}
                      clickable
                      color={selectedTime === slot.startTime ? 'primary' : 'default'}
                      variant={selectedTime === slot.startTime ? 'filled' : 'outlined'}
                      onClick={() => {
                        onSelectTime(slot.startTime, slot.endTime);
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {errors.startTime && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.startTime}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DateTimeSelectionStep;
export type { DateTimeSelectionStepProps, Dentist, AvailableSlot, ValidationErrors };
