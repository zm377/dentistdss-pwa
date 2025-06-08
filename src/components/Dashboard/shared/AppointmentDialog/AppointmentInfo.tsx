import React from 'react';
import { Grid, Box, Typography, Chip } from '@mui/material';
import {
  Person as PatientIcon,
  MedicalServices as DentistIcon,
  LocationOn as ClinicIcon,
} from '@mui/icons-material';
import { getStatusColor } from '../../../../utils/dashboard/dashboardUtils';
import { getPatientName, getDentistName } from './utils';
import type { Appointment } from './types';

interface AppointmentInfoProps {
  appointment: Appointment;
}

/**
 * AppointmentInfo component
 * Displays patient and dentist information
 */
export const AppointmentInfo: React.FC<AppointmentInfoProps> = ({ appointment }) => {
  const statusColor = getStatusColor(appointment.status);

  return (
    <>
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
          {getPatientName(appointment)}
        </Typography>
        {appointment.patient?.email && (
          <Typography variant="body2" color="text.secondary">
            {appointment.patient.email}
          </Typography>
        )}
        {appointment.patient?.phone && (
          <Typography variant="body2" color="text.secondary">
            {appointment.patient.phone}
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
          {getDentistName(appointment)}
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
    </>
  );
};
