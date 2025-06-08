import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  canEdit,
  getServiceName,
  getUrgencyDisplay,
  getReasonDisplay,
  getSymptomsDisplay,
  getNotesDisplay,
} from './utils';
import type { Appointment, EditData, ValidationErrors, DialogMode } from './types';

interface AppointmentDetailsProps {
  appointment: Appointment;
  mode: DialogMode;
  editData: EditData;
  errors: ValidationErrors;
  onFieldChange: (field: keyof EditData, value: string) => void;
}

/**
 * AppointmentDetails component
 * Handles service, urgency, reason, symptoms, and notes
 */
export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  mode,
  editData,
  errors,
  onFieldChange,
}) => {
  const isEditable = canEdit(mode);
  const isEditMode = mode === 'edit';

  return (
    <>
      {/* Service Information */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Service Type</Typography>
        <Typography variant="body1">{getServiceName(appointment)}</Typography>
      </Grid>

      {/* Urgency */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Urgency</Typography>
        {isEditable && isEditMode ? (
          <FormControl fullWidth>
            <InputLabel>Urgency</InputLabel>
            <Select
              value={editData.urgency}
              label="Urgency"
              onChange={(e) => onFieldChange('urgency', e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
            {getUrgencyDisplay(appointment)}
          </Typography>
        )}
      </Grid>

      {/* Reason */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Reason for Visit</Typography>
        {isEditable && isEditMode ? (
          <TextField
            fullWidth
            multiline
            rows={2}
            value={editData.reason}
            onChange={(e) => onFieldChange('reason', e.target.value)}
            error={!!errors.reason}
            helperText={errors.reason}
          />
        ) : (
          <Typography variant="body1">
            {getReasonDisplay(appointment)}
          </Typography>
        )}
      </Grid>

      {/* Symptoms */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Symptoms</Typography>
        {isEditable && isEditMode ? (
          <TextField
            fullWidth
            multiline
            rows={2}
            value={editData.symptoms}
            onChange={(e) => onFieldChange('symptoms', e.target.value)}
          />
        ) : (
          <Typography variant="body1">
            {getSymptomsDisplay(appointment)}
          </Typography>
        )}
      </Grid>

      {/* Notes */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Notes</Typography>
        {isEditable && isEditMode ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editData.notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
          />
        ) : (
          <Typography variant="body1">
            {getNotesDisplay(appointment)}
          </Typography>
        )}
      </Grid>
    </>
  );
};
