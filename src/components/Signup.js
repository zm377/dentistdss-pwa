import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Link as MuiLink, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook'; // Example for other providers
import MicrosoftIcon from '@mui/icons-material/Microsoft'; // Example for Microsoft

const Signup = () => {
  const { signup, oauthLogin: authOauthLogin } = useAuth();
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

    setLoading(true);
    try {
      // Use the signup function from AuthContext
      await signup(email, password); 
      // Decide navigation after signup (e.g., to login or directly to home)
      navigate('/'); // Navigate to home page on successful signup (or '/login')
    } catch (err) { 
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to create an account. Please try again.'); // Display error from context or default
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
            {loading ? 'Signing Up...' : 'Sign Up as Patient'}
          </Button>
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => handleOauthLogin('google')}
                    sx={{ textTransform: 'none' }}
                >
                    Sign Up with Google
                </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<MicrosoftIcon />}
                    onClick={() => handleOauthLogin('microsoft')}
                    sx={{ textTransform: 'none' }}
                >
                    Sign Up with Microsoft
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