import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PatientIcon,
  MedicalServices as DentistIcon,
  Schedule as TimeIcon,
  LocationOn as ClinicIcon,
} from '@mui/icons-material';
import CalendarDatePicker from '../CalendarDatePicker';
import TimeSelector from '../TimeSelector';
import { formatDate, formatTime, getStatusColor } from '../../../../utils/dashboard/dashboardUtils';

/**
 * AppointmentDialog - Dialog for viewing and editing appointment details
 * 
 * Features:
 * - View appointment details
 * - Edit appointment information (role-based)
 * - Reschedule functionality
 * - Status updates
 * - Responsive design
 */
const AppointmentDialog = memo(({
  open,
  onClose,
  appointment,
  mode = 'view', // 'view', 'edit', 'reschedule'
  userRole,
  onSave,
  onReschedule,
  onCancel,
  onConfirm,
  onMarkNoShow,
  onComplete,
  loading = false,
}) => {
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize edit data when appointment changes
  useEffect(() => {
    if (appointment) {
      setEditData({
        date: appointment.appointmentDate || appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        reason: appointment.reasonForVisit || appointment.reason || '',
        symptoms: appointment.symptoms || '',
        notes: appointment.notes || '',
        urgency: appointment.urgencyLevel || appointment.urgency || 'medium',
      });
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (mode === 'reschedule') {
      if (!editData.date) newErrors.date = 'Date is required';
      if (!editData.startTime) newErrors.startTime = 'Start time is required';
      if (!editData.endTime) newErrors.endTime = 'End time is required';
    }
    
    if (mode === 'edit') {
      if (!editData.reason?.trim()) newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (mode === 'reschedule' && onReschedule) {
        onReschedule(appointment, editData.date, editData.startTime, editData.endTime);
      } else if (mode === 'edit' && onSave) {
        onSave(appointment, editData);
      }
    }
  };

  const canEdit = () => {
    return mode === 'edit' || mode === 'reschedule';
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Edit Appointment';
      case 'reschedule':
        return 'Reschedule Appointment';
      default:
        return 'Appointment Details';
    }
  };

  const statusColor = getStatusColor(appointment.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
      }}>
        {getDialogTitle()}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Grid container spacing={3}>
          {/* Status */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">Status:</Typography>
              <Chip
                label={appointment.status}
                sx={{
                  backgroundColor: statusColor,
                  color: 'white',
                  fontWeight: 'medium',
                }}
              />
            </Box>
          </Grid>

          {/* Patient Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PatientIcon color="primary" />
              <Typography variant="h6">Patient</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {appointment.patientName || 'Unknown Patient'}
            </Typography>
            {appointment.patientEmail && (
              <Typography variant="body2" color="text.secondary">
                {appointment.patientEmail}
              </Typography>
            )}
            {appointment.patientPhone && (
              <Typography variant="body2" color="text.secondary">
                {appointment.patientPhone}
              </Typography>
            )}
          </Grid>

          {/* Dentist Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DentistIcon color="primary" />
              <Typography variant="h6">Dentist</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Dr. {appointment.dentistName || 'Unknown'}
            </Typography>
            {appointment.clinicName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <ClinicIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {appointment.clinicName}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>

          {/* Date and Time */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TimeIcon color="primary" />
              <Typography variant="h6">Date & Time</Typography>
            </Box>

            {canEdit() && mode === 'reschedule' ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CalendarDatePicker
                    label="Date"
                    value={editData.date ? new Date(editData.date) : null}
                    onChange={(date) => handleFieldChange('date', date?.toISOString().split('T')[0])}
                    minDate={new Date()}
                    fullWidth
                    error={!!errors.date}
                    helperText={errors.date || 'Select new appointment date'}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TimeSelector
                    label="Start Time"
                    value={editData.startTime}
                    onChange={(time) => handleFieldChange('startTime', time)}
                    fullWidth
                    error={!!errors.startTime}
                    helperText={errors.startTime || 'Select start time'}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TimeSelector
                    label="End Time"
                    value={editData.endTime}
                    onChange={(time) => handleFieldChange('endTime', time)}
                    fullWidth
                    error={!!errors.endTime}
                    helperText={errors.endTime || 'Select end time'}
                    required
                  />
                </Grid>
              </Grid>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formatDate(appointment.appointmentDate || appointment.date)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Service Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Service Type</Typography>
            <Typography variant="body1">{appointment.serviceName || appointment.serviceType || 'Not specified'}</Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Urgency</Typography>
            {canEdit() && mode === 'edit' ? (
              <FormControl fullWidth>
                <InputLabel>Urgency</InputLabel>
                <Select
                  value={editData.urgency}
                  label="Urgency"
                  onChange={(e) => handleFieldChange('urgency', e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {appointment.urgencyLevel || appointment.urgency || 'Medium'}
              </Typography>
            )}
          </Grid>

          {/* Reason */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Reason for Visit</Typography>
            {canEdit() && mode === 'edit' ? (
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editData.reason}
                onChange={(e) => handleFieldChange('reason', e.target.value)}
                error={!!errors.reason}
                helperText={errors.reason}
              />
            ) : (
              <Typography variant="body1">
                {appointment.reasonForVisit || appointment.reason || 'No reason provided'}
              </Typography>
            )}
          </Grid>

          {/* Symptoms */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Symptoms</Typography>
            {canEdit() && mode === 'edit' ? (
              <TextField
                fullWidth
                multiline
                rows={2}
                value={editData.symptoms}
                onChange={(e) => handleFieldChange('symptoms', e.target.value)}
              />
            ) : (
              <Typography variant="body1">
                {appointment.symptoms || 'No symptoms reported'}
              </Typography>
            )}
          </Grid>

          {/* Notes */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Notes</Typography>
            {canEdit() && mode === 'edit' ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editData.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
              />
            ) : (
              <Typography variant="body1">
                {appointment.notes || 'No additional notes'}
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          {canEdit() ? 'Cancel' : 'Close'}
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        {mode === 'view' && (
          <>
            {appointment.status === 'pending' && onConfirm && (
              <Button onClick={() => onConfirm(appointment)} variant="outlined" color="success">
                Confirm
              </Button>
            )}
            {appointment.status === 'confirmed' && onComplete && (
              <Button onClick={() => onComplete(appointment)} variant="outlined" color="primary">
                Complete
              </Button>
            )}
            {appointment.status === 'confirmed' && onMarkNoShow && (
              <Button onClick={() => onMarkNoShow(appointment)} variant="outlined" color="warning">
                No-Show
              </Button>
            )}
            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && onCancel && (
              <Button onClick={() => onCancel(appointment)} variant="outlined" color="error">
                Cancel
              </Button>
            )}
          </>
        )}
        
        {canEdit() && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

AppointmentDialog.propTypes = {
  /** Whether the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Callback to close the dialog */
  onClose: PropTypes.func.isRequired,
  /** Appointment object */
  appointment: PropTypes.object,
  /** Dialog mode */
  mode: PropTypes.oneOf(['view', 'edit', 'reschedule']),
  /** User role */
  userRole: PropTypes.string,
  /** Callback to save changes */
  onSave: PropTypes.func,
  /** Callback to reschedule */
  onReschedule: PropTypes.func,
  /** Callback to cancel appointment */
  onCancel: PropTypes.func,
  /** Callback to confirm appointment */
  onConfirm: PropTypes.func,
  /** Callback to mark no-show */
  onMarkNoShow: PropTypes.func,
  /** Callback to complete appointment */
  onComplete: PropTypes.func,
  /** Loading state */
  loading: PropTypes.bool,
};

AppointmentDialog.displayName = 'AppointmentDialog';

export default AppointmentDialog;
