import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate(); // Hook for navigation

  const oauthLogin = (provider) => {
    // Placeholder for OAuth login logic
    console.log(`OAuth login with ${provider} not implemented yet.`);
    // You'll want to redirect to your backend or the OAuth provider's page
    // Example: window.location.href = `/auth/${provider}`;
    setError(`OAuth login with ${provider} is not yet implemented.`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use the login function from AuthContext
      await login(email, password); 
      navigate('/'); // Navigate to home page on successful login
    } catch (err) { 
      console.error('Login failed:', err);
      setError(err.message || 'Failed to log in. Please check your credentials.'); // Display error from context or default
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Log In
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {/* Add Remember me checkbox if needed */}
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
            {loading ? 'Logging In...' : 'Log In'}
          </Button>

          {/* OAuth Buttons */}
          <Typography variant="body2" align="center" sx={{ mt: 2, mb: 1 }}>
            Or log in with
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {/* Replace with actual icons or styled buttons */}
            <Button 
              variant="outlined" 
              onClick={() => oauthLogin('google')} 
              disabled={loading}
              size="small"
              // Add Google Icon here later
            >
              Google
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => oauthLogin('microsoft')} 
              disabled={loading}
              size="small"
              // Add Microsoft Icon here later
            >
              Microsoft
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => oauthLogin('apple')} 
              disabled={loading}
              size="small"
              // Add Apple Icon here later
            >
              Apple
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={RouterLink} to="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </MuiLink>
          </Box>
          {/* Add Forgot Password link if needed */}
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;