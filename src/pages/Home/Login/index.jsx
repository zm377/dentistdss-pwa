import React, {useState, useRef, useEffect} from 'react';
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
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useAuth} from '../../../context/auth';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {GoogleLogin} from '@react-oauth/google';
import {useMediaQuery} from '@mui/material';

function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUsingEmailLogin, setIsUsingEmailLogin] = useState(false);
  const {login, googleIdLogin} = useAuth();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef(null);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(isSmallMobile ? '100%' : isMobile ? '374px' : '354px');

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;

      const {width} = entries[0].contentRect;
      // Subtract some padding to account for the button's internal padding
      const buttonWidth = Math.max(250, Math.floor(width));
      setGoogleButtonWidth(`${buttonWidth}px`);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const validateEmail = (emailToValidate) => {
    if (!emailToValidate) {
      return 'Email is required';
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(emailToValidate)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Mark that user is interacting with email/password form
    setIsUsingEmailLogin(true);
    // Only validate if there's an existing error (real-time validation)
    if (emailError) {
      setEmailError(validateEmail(newEmail));
    }
  };

  const handleEmailBlur = () => {
    // Only validate on blur if user is actively using email/password login
    if (isUsingEmailLogin) {
      setEmailError(validateEmail(email));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Mark that user is interacting with email/password form
    if (!isUsingEmailLogin) {
      setIsUsingEmailLogin(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLoginClick = () => {
    // Clear validation errors when user interacts with Google login
    setEmailError('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Mark that user is definitely using email/password login
    setIsUsingEmailLogin(true);

    // Validate email and password
    const currentEmailError = validateEmail(email);
    setEmailError(currentEmailError);

    if (currentEmailError) {
      return;
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

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
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 4 }
        }}
      >
        <Paper
            elevation={3}
            sx={{
              mt: { xs: 4, sm: 6, md: 8 },
              p: { xs: 2.5, sm: 3, md: 4 },
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
              variant={isMobile ? "h5" : "h4"}
              sx={{
                color: theme.palette.mode === 'dark'
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                mb: { xs: 2, sm: 2.5, md: 3 },
                fontWeight: 600,
                textAlign: 'center'
              }}
          >
            Log In
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, width: '100%'}}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus={!isMobile} // Disable autofocus on mobile to prevent keyboard popup
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={!!emailError}
                helperText={emailError}
                disabled={loading}
                inputProps={{
                  inputMode: 'email',
                  type: 'email'
                }}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'}/>
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
                onChange={handlePasswordChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color={theme.palette.mode === 'dark' ? 'primary' : 'action'}/>
                      </InputAdornment>
                  ),
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : undefined}}
                        >
                          {showPassword ? <VisibilityOff/> : <Visibility/>}
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
                  <Typography color="error" variant="body2" sx={{textAlign: 'center'}}>
                    {error}
                  </Typography>
                </Box>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "large"}
                sx={{
                  mt: { xs: 2.5, sm: 3 },
                  mb: { xs: 1.5, sm: 2 },
                  py: { xs: 1.5, sm: 1.8 },
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  minHeight: { xs: 48, sm: 52 },
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
                Or
              </Typography>
            </Divider>

            <Grid container spacing={2} justifyContent="center">
              <Grid size={{ xs: 12 }} sx={{display: 'flex', justifyContent: 'center'}}>
                <Box
                    ref={containerRef}
                    sx={{
                      width: '100%',
                      '.google-button': {
                        width: '100% !important',
                        marginInline: '0 !important',
                        borderRadius: '4px',
                        '& div[style]': {
                          width: '100% !important',
                          margin: '0 !important'
                        }
                      }
                    }}
                    onClick={handleGoogleLoginClick}
                >
                  <GoogleLogin
                      className="google-button"
                      size="large"
                      width={googleButtonWidth}
                      onSuccess={async (credentialResponse) => {
                        try {
                          setLoading(true);
                          // Clear any email validation errors when using Google login
                          setEmailError('');
                          setError('');
                          setIsUsingEmailLogin(false);
                          await googleIdLogin(credentialResponse.credential);
                          navigate('/dashboard');
                        } catch (err) {
                          console.error(err);
                          setError(err.message || 'Google login failed');
                        }
                        setLoading(false);
                      }}
                      onError={() => {
                        setError('Google login failed');
                      }}
                      useOneTap={false}
                      text="continue_with"
                      type="standard"
                      shape="rectangular"
                      theme={theme.palette.mode === 'dark' ? 'filled_black' : 'filled_blue'}
                      logo_alignment="left"
                  />
                </Box>
              </Grid>
            </Grid>

            <Box sx={{mt: 4, textAlign: 'center'}}>
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