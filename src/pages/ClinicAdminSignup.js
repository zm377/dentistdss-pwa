import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  useTheme,
  Divider
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../api';

const ClinicAdminSignup = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    clinicName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    businessEmail: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    // Basic validation – ensure required fields (simple check, can be expanded)
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'clinicName',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'phoneNumber',
      'businessEmail',
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return setError('Please fill in all required fields.');
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        role: 'clinic_admin', // Ensure backend recognises the role
      };

      await api.auth.signupClinicAdmin(payload);

      alert('Signup request submitted! Please check your email for verification. Your clinic registration is pending approval by the DentistDSS team.');
      navigate('/verify-email-pending', { state: { email: formData.email, firstName: formData.firstName } });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign up. Please try again.');
    }
    setLoading(false);
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.15)',
      },
      '&:hover fieldset': {
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(0, 0, 0, 0.25)',
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined,
    },
    '& .MuiInputBase-input': {
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined,
    },
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? 'rgba(42, 45, 50, 0.9)'
              : theme.palette.background.paper,
          borderRadius: 2,
          border:
            theme.palette.mode === 'dark'
              ? `1px solid ${theme.palette.divider}`
              : 'none',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            color:
              theme.palette.mode === 'dark'
                ? theme.palette.primary.light
                : theme.palette.primary.main,
            mb: 3,
            fontWeight: 600,
          }}
        >
          Clinic Administrator Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            {/* ---------- SECTION: ADMIN INFO ---------- */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                Administrator Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            {/* User information */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword} edge="end" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined }}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>

            {/* ---------- SECTION: CLINIC INFO ---------- */}
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                Clinic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            {/* Clinic information */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="clinicName"
                label="Clinic Name"
                id="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="address"
                label="Address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                name="city"
                label="City or Suburb"
                id="city"
                value={formData.city}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                name="state"
                label="State or Territory"
                id="state"
                value={formData.state}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                name="zipCode"
                label="Postcode"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                name="country"
                label="Country"
                id="country"
                value={formData.country}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PublicIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="businessEmail"
                label="Clinic Business Email"
                id="businessEmail"
                autoComplete="email"
                value={formData.businessEmail}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalPhoneIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
          </Grid>

          {error && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(211, 47, 47, 0.15)'
                    : 'rgba(211, 47, 47, 0.05)',
                borderRadius: 1,
                border: `1px solid ${theme.palette.error.main}`,
              }}
            >
              <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 4px 12px rgba(0, 100, 80, 0.3)'
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 6px 16px rgba(0, 100, 80, 0.4)'
                    : '0 6px 16px rgba(0, 0, 0, 0.15)',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            By clicking Sign Up, you agree to our{' '}
            <MuiLink component={RouterLink} to="/terms" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>
              Terms &amp; Conditions
            </MuiLink>
          </Typography>

          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid item>
              <MuiLink
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Already have an account? Sign in
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink
                component={RouterLink}
                to="/clinic-staff-signup"
                variant="body2"
                sx={{
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Staff sign up instead
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClinicAdminSignup; 