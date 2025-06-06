import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../../context/auth';
import api from '../../../../services';
import useFormValidation from '../../../../hooks/useFormValidation';
import { COUNTRIES } from '../../../../utils/dictionary';

/**
 * ClinicInformationForm - Comprehensive clinic information management form
 * 
 * Features:
 * - Complete clinic information editing
 * - Form validation with real-time feedback
 * - Loading states and error handling
 * - Responsive design with Material-UI
 * - Dark mode support
 * - Success/error notifications
 */
const ClinicInformationForm = ({ clinicData, onUpdate }) => {
  const { currentUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    email: '',
  });

  // UI state
  const [loading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Form validation
  const { validateEmail } = useFormValidation();
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Required fields
  const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'country', 'phoneNumber', 'email'];

  // Get field label for error messages
  const getFieldLabel = (field) => {
    const labels = {
      name: 'Clinic Name',
      address: 'Address',
      city: 'City',
      state: 'State/Province',
      zipCode: 'ZIP/Postal Code',
      country: 'Country',
      phoneNumber: 'Phone Number',
      email: 'Email Address',
    };
    return labels[field] || field;
  };

  // Initialize form data when clinic data is loaded
  useEffect(() => {
    if (clinicData) {
      const initialData = {
        name: clinicData.name || '',
        address: clinicData.address || '',
        city: clinicData.city || '',
        state: clinicData.state || '',
        zipCode: clinicData.zipCode || '',
        country: clinicData.country || '',
        phoneNumber: clinicData.phoneNumber || clinicData.phone || '',
        email: clinicData.email || '',
      };
      setFormData(initialData);
      setHasChanges(false);
      setError('');
    }
  }, [clinicData]);

  // Handle input changes with validation
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validate field
    let error = '';
    if (field === 'email') {
      error = validateEmail(value);
    } else if (requiredFields.includes(field) && !value.trim()) {
      error = `${getFieldLabel(field)} is required`;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    // Track changes
    const originalValue = clinicData?.[field] || clinicData?.phone || '';
    setHasChanges(value !== originalValue);
  };

  // Handle field blur for validation
  const handleFieldBlur = (field) => () => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        errors[field] = `${getFieldLabel(field)} is required`;
        isValid = false;
      }
    });
    
    // Validate email format
    if (formData.email) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError;
        isValid = false;
      }
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    // Validate form
    if (!validateForm()) {
      setError('Please correct the errors below before saving.');
      return;
    }
    
    if (!currentUser?.clinicId) {
      setError('No clinic ID found. Please contact support.');
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
      };
      
      // Call API to update clinic
      const updatedClinic = await api.clinic.updateClinic(currentUser.clinicId, updateData);
      
      // Show success notification
      window.dispatchEvent(new CustomEvent('show-snackbar', {
        detail: {
          message: 'Clinic information updated successfully!',
          severity: 'success'
        }
      }));
      
      // Update parent component
      if (onUpdate) {
        onUpdate(updatedClinic);
      }
      
      setHasChanges(false);
      
    } catch (err) {
      console.error('Failed to update clinic information:', err);
      const errorMessage = err.message || 'Failed to update clinic information. Please try again.';
      setError(errorMessage);
      
      // Show error notification
      window.dispatchEvent(new CustomEvent('show-snackbar', {
        detail: {
          message: errorMessage,
          severity: 'error'
        }
      }));
    } finally {
      setSaving(false);
    }
  };

  // Handle reset form
  const handleReset = () => {
    if (clinicData) {
      const resetData = {
        name: clinicData.name || '',
        address: clinicData.address || '',
        city: clinicData.city || '',
        state: clinicData.state || '',
        zipCode: clinicData.zipCode || '',
        country: clinicData.country || '',
        phoneNumber: clinicData.phoneNumber || clinicData.phone || '',
        email: clinicData.email || '',
      };
      setFormData(resetData);
      setFieldErrors({});
      setTouchedFields({});
      setHasChanges(false);
      setError('');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Clinic Information"
        subheader="Update your clinic's contact information and details"
        sx={{
          pb: 1,
          '& .MuiCardHeader-title': {
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
          },
          '& .MuiCardHeader-subheader': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            mt: 0.5,
          },
        }}
      />
      <Divider />
      <CardContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Clinic Name */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Clinic Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange('name')}
                onBlur={handleFieldBlur('name')}
                error={touchedFields.name && !!fieldErrors.name}
                helperText={touchedFields.name && fieldErrors.name}
                required
                variant="outlined"
                disabled={saving}
              />
            </Grid>

            {/* Phone Number */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange('phoneNumber')}
                onBlur={handleFieldBlur('phoneNumber')}
                error={touchedFields.phoneNumber && !!fieldErrors.phoneNumber}
                helperText={touchedFields.phoneNumber && fieldErrors.phoneNumber}
                required
                variant="outlined"
                disabled={saving}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                onBlur={handleFieldBlur('email')}
                error={touchedFields.email && !!fieldErrors.email}
                helperText={touchedFields.email && fieldErrors.email}
                required
                variant="outlined"
                disabled={saving}
              />
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange('address')}
                onBlur={handleFieldBlur('address')}
                error={touchedFields.address && !!fieldErrors.address}
                helperText={touchedFields.address && fieldErrors.address}
                required
                variant="outlined"
                disabled={saving}
                rows={2}
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange('city')}
                onBlur={handleFieldBlur('city')}
                error={touchedFields.city && !!fieldErrors.city}
                helperText={touchedFields.city && fieldErrors.city}
                required
                variant="outlined"
                disabled={saving}
              />
            </Grid>

            {/* State */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleInputChange('state')}
                onBlur={handleFieldBlur('state')}
                error={touchedFields.state && !!fieldErrors.state}
                helperText={touchedFields.state && fieldErrors.state}
                required
                variant="outlined"
                disabled={saving}
              />
            </Grid>

            {/* ZIP Code */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="ZIP/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange('zipCode')}
                onBlur={handleFieldBlur('zipCode')}
                error={touchedFields.zipCode && !!fieldErrors.zipCode}
                helperText={touchedFields.zipCode && fieldErrors.zipCode}
                required
                variant="outlined"
                disabled={saving}
              />
            </Grid>

            {/* Country */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={touchedFields.country && !!fieldErrors.country}
                disabled={saving}
                required
              >
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  labelId="country-label"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange('country')}
                  onBlur={handleFieldBlur('country')}
                  label="Country"
                >
                  {COUNTRIES.map((country) => (
                    <MenuItem key={country.code} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
                {touchedFields.country && fieldErrors.country && (
                  <FormHelperText>{fieldErrors.country}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={saving || !hasChanges}
              startIcon={<RefreshIcon />}
              sx={{ order: { xs: 2, sm: 1 } }}
            >
              Reset Changes
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={saving || !hasChanges}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{ order: { xs: 1, sm: 2 } }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

ClinicInformationForm.propTypes = {
  /** Clinic data object */
  clinicData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    country: PropTypes.string,
    phoneNumber: PropTypes.string,
    phone: PropTypes.string, // Alternative field name
    email: PropTypes.string,
  }),
  /** Callback function called when clinic data is updated */
  onUpdate: PropTypes.func,
};

export default ClinicInformationForm;
