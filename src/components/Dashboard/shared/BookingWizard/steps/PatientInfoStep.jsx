import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import CalendarDatePicker from '../../CalendarDatePicker';

/**
 * PatientInfoStep - Fourth step for patient information (new patients only)
 */
const PatientInfoStep = ({
  patientData,
  onUpdatePatientData,
  errors,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Patient Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide your personal information to create your patient profile.
      </Typography>

      <Grid container spacing={3}>
        {/* First Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            value={patientData.firstName}
            onChange={(e) => onUpdatePatientData('firstName', e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
          />
        </Grid>

        {/* Last Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            value={patientData.lastName}
            onChange={(e) => onUpdatePatientData('lastName', e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={patientData.email}
            onChange={(e) => onUpdatePatientData('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            value={patientData.phone}
            onChange={(e) => onUpdatePatientData('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
        </Grid>

        {/* Date of Birth */}
        <Grid size={{ xs: 12, md: 6 }}>
          <CalendarDatePicker
            label="Date of Birth"
            value={patientData.dateOfBirth ? new Date(patientData.dateOfBirth) : null}
            onChange={(date) => onUpdatePatientData('dateOfBirth', date?.toISOString().split('T')[0])}
            maxDate={new Date()}
            fullWidth
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth || 'Select your date of birth'}
          />
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address (Optional)"
            multiline
            rows={2}
            value={patientData.address}
            onChange={(e) => onUpdatePatientData('address', e.target.value)}
            helperText="Your home address"
          />
        </Grid>

        {/* Emergency Contact */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Emergency Contact (Optional)"
            value={patientData.emergencyContact}
            onChange={(e) => onUpdatePatientData('emergencyContact', e.target.value)}
            helperText="Name and phone number of emergency contact"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

PatientInfoStep.propTypes = {
  patientData: PropTypes.object.isRequired,
  onUpdatePatientData: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default PatientInfoStep;
