import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Link as MuiLink, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook'; // Example for other providers


const Signup = () => {
  const { signup, oauthLogin: authOauthLogin } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleOauthLogin = (provider) => {
    // Placeholder for OAuth login logic
    console.log(`OAuth login with ${provider} not implemented yet.`);
    // You'll want to redirect to your backend or the OAuth provider's page
    // Example: window.location.href = `/auth/${provider}`;
    setError(`OAuth login with ${provider} is not yet implemented.`);
    
    // Call the actual OAuth login from context when implemented
    // authOauthLogin(provider);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!firstName || !lastName) {
      return setError('First name and last name are required');
    }

    setLoading(true);
    try {
      // The role 'patient' is implicitly handled by this form.
      // The signup function from AuthContext will be called.
      // We need to ensure it doesn't auto-login patients but signals success for redirection.
      const result = await signup(email, password, firstName, lastName, 'patient');

      // Assuming signup now returns something to indicate success without auto-login for patients
      // or that the API call itself was successful and email verification is the next step.
      // If signup in AuthContext still auto-logs in, this logic will need adjustment there.
      // For now, proceed to pending verification page.
      navigate('/verify-email-pending', { state: { email: email, firstName: firstName } });

    } catch (err) { 
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to create an account. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
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
          <Typography variant="body2" align="center" sx={{ mt: 2, mb: 1 }}>
            Or
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <Grid item xs={12}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => handleOauthLogin('google')}
                    sx={{ textTransform: 'none' }} // Keep textTransform if desired, or remove for default
                >
                    Sign Up with Google
                </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent="space-between">
            <Grid item>
              <MuiLink component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={RouterLink} to="/clinic-staff-signup" variant="body2">
                I work for a clinic
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;