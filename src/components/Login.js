import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Link as MuiLink, 
  Grid, 
  useTheme,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const oauthLogin = (provider) => {
    console.log(`OAuth login with ${provider} not implemented yet.`);
    setError(`OAuth login with ${provider} is not yet implemented.`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password); 
      navigate('/dashboard');
    } catch (err) { 
      console.error('Login failed:', err);
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
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
          Log In
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'} />
                </InputAdornment>
              ),
            }}
            sx={{
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
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
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
            sx={{
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
            }}
          />
          
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
            {loading ? 'Logging In...' : 'Log In'}
          </Button>

          <Divider sx={{ 
            my: 3, 
            '&::before, &::after': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : undefined
            }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                px: 1, 
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary 
              }}
            >
              Or continue with
            </Typography>
          </Divider>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<GoogleIcon />}
                onClick={() => oauthLogin('google')} 
                disabled={loading}
                sx={{ 
                  textTransform: 'none', 
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : theme.palette.divider,
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.primary,
                  py: 1.2,
                  '&:hover': {
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : undefined,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : undefined
                  }
                }}
              >
                Log In with Google
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
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
              {"Don't have an account? Sign Up"}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;