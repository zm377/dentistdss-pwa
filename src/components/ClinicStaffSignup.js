import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography, Link as MuiLink, MenuItem, Select, InputLabel } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Assuming AuthContext will handle signup
import { useAuth } from '../context/AuthContext';

const ClinicStaffSignup = () => {
  // const { signup } = useAuth(); // Or a specific signup function for clinic staff
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: '', // 'clinic_admin', 'dentist', 'receptionist'
    clinicName: '', // For new clinic admins
    existingClinicId: '', // For dentists and receptionists
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState([]); // Mock data, replace with API call

  // Mock fetch clinics - replace with actual API call
  React.useEffect(() => {
    if (formData.role === 'dentist' || formData.role === 'receptionist') {
      // Simulate fetching clinics
      setTimeout(() => {
        setClinics([
          { id: 'clinic1', name: 'Sunshine Dental Clinic' },
          { id: 'clinic2', name: 'Bright Smiles Dental Care' },
          { id: 'clinic3', name: 'Community Dental Center' },
        ]);
      }, 500);
    }
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'role') {
        // Reset clinic fields when role changes
        setFormData(prev => ({ ...prev, clinicName: '', existingClinicId: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Basic validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.role) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }

    if (formData.role === 'clinic_admin' && !formData.clinicName) {
        setError('Clinic name is required for Clinic Administrators.');
        setLoading(false);
        return;
    }

    if ((formData.role === 'dentist' || formData.role === 'receptionist') && !formData.existingClinicId) {
        setError('Please select a clinic.');
        setLoading(false);
        return;
    }

    try {
      console.log('Submitting clinic staff signup:', formData);
      // TODO: Implement actual signup logic
      // await signup(formData.email, formData.password, formData.fullName, formData.role, formData.clinicName, formData.existingClinicId);
      // Mock success
      // setTimeout(() => {
      //   alert('Signup request submitted! Please check your email for verification and await administrator approval.');
      //   navigate('/login'); // Or a pending approval page
      // }, 1000);

      const result = await signup(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        formData.clinicName,
        formData.existingClinicId
      );

      if (result && result.approvalStatus === 'pending') {
        alert('Signup request submitted! Please check your email for verification and await administrator approval.');
        navigate('/login'); // Or a specific page for pending approval
      } else if (result && result.approvalStatus === 'approved'){
        // This case should ideally not happen for staff roles directly from this form as per requirements
        // but if it does, navigate to their dashboard
        alert('Signup successful! You are now logged in.');
        navigate('/dashboard'); 
      } else {
        // Handle cases where signup might fail or return unexpected status
        setError('An unexpected error occurred during signup. Please try again.');
      }

    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Clinic Staff Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Role*</FormLabel>
                <RadioGroup
                  row
                  aria-label="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <FormControlLabel value="clinic_admin" control={<Radio />} label="Dental Clinic Administrator" />
                  <FormControlLabel value="dentist" control={<Radio />} label="Dentist" />
                  <FormControlLabel value="receptionist" control={<Radio />} label="Receptionist" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.role === 'clinic_admin' && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="clinicName"
                  label="New Clinic Name"
                  id="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  helperText="If your clinic is new, enter its name here."
                />
              </Grid>
            )}

            {(formData.role === 'dentist' || formData.role === 'receptionist') && (
              <Grid item xs={12}>
                <FormControl fullWidth required>
                    <InputLabel id="existing-clinic-label">Select Clinic</InputLabel>
                    <Select
                        labelId="existing-clinic-label"
                        id="existingClinicId"
                        name="existingClinicId"
                        value={formData.existingClinicId}
                        label="Select Clinic"
                        onChange={handleChange}
                    >
                        {clinics.length === 0 && <MenuItem value="" disabled>Loading clinics...</MenuItem>}
                        {clinics.map((clinic) => (
                            <MenuItem key={clinic.id} value={clinic.id}>{clinic.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink component={RouterLink} to="/signup" variant="body2">
                Are you a patient? Sign up here
              </MuiLink>
            </Grid>
            <Grid item sx={{ ml: 'auto' }}>
                <MuiLink component={RouterLink} to="/login" variant="body2">
                    Already have an account? Sign in
                </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ClinicStaffSignup;