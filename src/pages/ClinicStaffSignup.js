import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  Grid, 
  Radio, 
  RadioGroup, 
  TextField, 
  Typography, 
  Link as MuiLink, 
  MenuItem, 
  Select, 
  InputLabel,
  Paper,
  useTheme,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Assuming AuthContext will handle signup
import { useAuth } from '../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WorkIcon from '@mui/icons-material/Work';

const ClinicStaffSignup = () => {
  // const { signup } = useAuth(); // Or a specific signup function for clinic staff
  const { signupClinicStaff } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '', // 'clinic_admin', 'dentist', 'receptionist'
    clinicName: '', // For new clinic admins
    existingClinicId: '', // For dentists and receptionists
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [clinics, setClinics] = useState([]); // Mock data, replace with API call
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.role) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }

    if ((formData.role === 'dentist' || formData.role === 'receptionist') && !formData.existingClinicId) {
        setError('Please select a clinic.');
        setLoading(false);
        return;
    }

    try {
      const result = await signupClinicStaff(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role,
        formData.clinicName || null, // Ensure null if empty
        formData.existingClinicId || null // Ensure null if empty
      );

      // If signup call completes without error, it means it's pending verification/approval.
      // The AuthContext signup function returns { emailVerificationPending: true, ... } on success.
      alert('Signup request submitted! Please check your email for verification. Your account will also require administrator approval by your clinic administrator.');
      
      if (result && result.emailVerificationPending) {
        navigate('/verify-email-pending', { state: { email: formData.email } });
      } else {
        // Fallback, though AuthContext's signup for patients sets emailVerificationPending.
        // Assuming consistency or a generic next step.
        navigate('/login'); 
      }

    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Common text field styling
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
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
    '& .MuiFormHelperText-root': {
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : undefined,
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper 
        elevation={3}
        sx={{
          mt: 8, 
          p: { xs: 3, sm: 4 },
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(42, 45, 50, 0.9)' 
            : theme.palette.background.paper,
          borderRadius: 2,
          border: theme.palette.mode === 'dark' 
            ? `1px solid ${theme.palette.divider}` 
            : 'none',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            color: theme.palette.mode === 'dark' 
              ? theme.palette.primary.light 
              : theme.palette.primary.main, 
            mb: 3,
            fontWeight: 600
          }}
        >
          Clinic Staff Sign Up
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="first-name"
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="last-name"
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
            <Grid item xs={12}>
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
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
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
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                component="fieldset" 
                fullWidth 
                sx={{
                  '& .MuiFormLabel-root': {
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined,
                  },
                  '& .MuiFormControlLabel-root': {
                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined,
                  }
                }}
              >
                <FormLabel component="legend">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                    <Typography component="span">Role*</Typography>
                  </Box>
                </FormLabel>
                <RadioGroup
                  row
                  aria-label="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <FormControlLabel value="dentist" control={<Radio color="primary" />} label="Dentist" />
                  <FormControlLabel value="receptionist" control={<Radio color="primary" />} label="Receptionist" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {(formData.role === 'dentist' || formData.role === 'receptionist') && (
              <Grid item xs={12}>
                <FormControl 
                  fullWidth 
                  required
                  sx={{
                    ...textFieldSx,
                    '& .MuiInputLabel-root': {
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined,
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  <InputLabel id="existing-clinic-label">Select Clinic</InputLabel>
                  <Select
                    labelId="existing-clinic-label"
                    id="existingClinicId"
                    name="existingClinicId"
                    value={formData.existingClinicId}
                    label="Select Clinic"
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <BusinessIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                      </InputAdornment>
                    }
                    sx={{
                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : undefined,
                    }}
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
            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.15)' : 'rgba(211, 47, 47, 0.05)', 
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.main}`
            }}>
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
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 4px 12px rgba(0, 100, 80, 0.3)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 6px 16px rgba(0, 100, 80, 0.4)' 
                  : '0 6px 16px rgba(0, 0, 0, 0.15)',
              }
            }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
          
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            By clicking Create Account, you agree to our{' '}
            <MuiLink component={RouterLink} to="/terms" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>
              Terms &amp; Conditions
            </MuiLink>
          </Typography>
          
          <Grid container spacing={1} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <MuiLink 
                component={RouterLink} 
                to="/signup" 
                variant="body2"
                sx={{ 
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                No a staff? Sign up here
              </MuiLink>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
              <MuiLink 
                component={RouterLink} 
                to="/signup/clinic-admin" 
                variant="body2"
                sx={{ 
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Signup as Clinic Admin
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ClinicStaffSignup;