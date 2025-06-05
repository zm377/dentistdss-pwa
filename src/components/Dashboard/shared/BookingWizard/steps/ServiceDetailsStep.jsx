import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

/**
 * ServiceDetailsStep - Third step for service details
 */
const ServiceDetailsStep = ({
  serviceTypes,
  selectedService,
  reason,
  symptoms,
  urgency,
  notes,
  onSelectService,
  onUpdateReason,
  onUpdateSymptoms,
  onUpdateUrgency,
  onUpdateNotes,
  errors,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Service Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide details about your appointment.
      </Typography>

      <Grid container spacing={3}>
        {/* Service Type */}
        <Grid item size={3} xs={12} md={6}>
          <FormControl fullWidth error={!!errors.serviceType}>
            <InputLabel>Service Type</InputLabel>
            <Select
              value={selectedService}
              label="Service Type"
              onChange={(e) => onSelectService(e.target.value)}
            >
              {serviceTypes.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name} ({service.duration} min)
                </MenuItem>
              ))}
            </Select>
            {errors.serviceType && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.serviceType}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Urgency */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Urgency</InputLabel>
            <Select
              value={urgency}
              label="Urgency"
              onChange={(e) => onUpdateUrgency(e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reason */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reason for Visit"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => onUpdateReason(e.target.value)}
            error={!!errors.reason}
            helperText={errors.reason || 'Please describe the reason for your appointment'}
            required
          />
        </Grid>

        {/* Symptoms */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Symptoms (Optional)"
            multiline
            rows={3}
            value={symptoms}
            onChange={(e) => onUpdateSymptoms(e.target.value)}
            helperText="Describe any symptoms you're experiencing"
          />
        </Grid>

        {/* Additional Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Additional Notes (Optional)"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            helperText="Any additional information you'd like to share"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

ServiceDetailsStep.propTypes = {
  serviceTypes: PropTypes.array.isRequired,
  selectedService: PropTypes.string,
  reason: PropTypes.string,
  symptoms: PropTypes.string,
  urgency: PropTypes.string,
  notes: PropTypes.string,
  onSelectService: PropTypes.func.isRequired,
  onUpdateReason: PropTypes.func.isRequired,
  onUpdateSymptoms: PropTypes.func.isRequired,
  onUpdateUrgency: PropTypes.func.isRequired,
  onUpdateNotes: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default ServiceDetailsStep;
