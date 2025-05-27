import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Alert, 
  TextField,
  Button,
  CircularProgress,
  Stack
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import authAPI from '../../../services/auth'; // Assuming apiService is correctly set up

const MAX_RESEND_ATTEMPTS = 3;
const RESEND_WINDOW_SECONDS = 90;
const LOCAL_STORAGE_RESEND_KEY = 'resendVerificationStatus';

const VerifyEmailWithCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email: initialEmail, firstName: initialFirstName } = location.state || {};

  // Persist email and firstName in local state to survive potential state loss on refresh, though navigation usually handles this.
  const [email, setEmail] = useState(initialEmail);
  const [firstName, setFirstName] = useState(initialFirstName);

  const [verificationCode, setVerificationCode] = useState('');
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [countdown, setCountdown] = useState(2);

  // Effect to update local email/firstName if location.state changes (e.g. user navigates back and forth)
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialFirstName) setFirstName(initialFirstName);
  }, [initialEmail, initialFirstName]);

  useEffect(() => {
    const now = Date.now();
    const storedStatus = localStorage.getItem(LOCAL_STORAGE_RESEND_KEY);
    if (storedStatus) {
      const status = JSON.parse(storedStatus);
      if (status.timestamp) {
        const timePassedSeconds = (now - status.timestamp) / 1000;
        if (timePassedSeconds <= RESEND_WINDOW_SECONDS) {
          if (status.attempts >= MAX_RESEND_ATTEMPTS) {
            const timeLeft = Math.ceil(RESEND_WINDOW_SECONDS - timePassedSeconds);
            setResendDisabled(true);
            setResendCooldown(timeLeft);
            setResendError(`Too many attempts. Try again in ${timeLeft} seconds.`);
          }
        } else {
          localStorage.removeItem(LOCAL_STORAGE_RESEND_KEY);
        }
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      setResendDisabled(true); // Ensure button is disabled during cooldown
      timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            setResendError('');
            localStorage.removeItem(LOCAL_STORAGE_RESEND_KEY);
            return 0;
          }
          setResendError(`Too many attempts. Try again in ${prev - 1} seconds.`);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    let countdownTimer;
    if (showSuccessMessage && countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (showSuccessMessage && countdown === 0) {
      navigate('/login?verified=true');
    }
    return () => clearTimeout(countdownTimer);
  }, [showSuccessMessage, countdown, navigate]);

  const handleCodeChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
    setVerificationCode(input);
    setError(''); // Clear error when user types
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setLoadingVerify(true);
    setError('');
    setResendMessage('');
    setResendError('');

    try {
      const response = await authAPI.verifySignupWithCode(email, verificationCode);
      localStorage.removeItem(LOCAL_STORAGE_RESEND_KEY); // Clear resend limit on successful verification
      setShowSuccessMessage(true);
      setCountdown(3); // Reset countdown
      // Clear other messages/errors
      setError('');
      setResendMessage('');
      setResendError('');
    } catch (err) {
      console.error('Verification API error:', err);
      setError(err.response?.message || 'An error occurred during verification.');
    }
    setLoadingVerify(false);
  };

  const handleResendCode = async () => {
    if (!email) {
      setResendError('Email address not found. Cannot resend code.');
      return;
    }

    const now = Date.now();
    let currentStatus = JSON.parse(localStorage.getItem(LOCAL_STORAGE_RESEND_KEY) || 'null');

    if (currentStatus && currentStatus.timestamp && (now - currentStatus.timestamp) / 1000 > RESEND_WINDOW_SECONDS) {
      currentStatus = null; // Window expired, reset status
      localStorage.removeItem(LOCAL_STORAGE_RESEND_KEY);
    }

    if (currentStatus && currentStatus.attempts >= MAX_RESEND_ATTEMPTS) {
      const timeLeft = Math.ceil(RESEND_WINDOW_SECONDS - (now - currentStatus.timestamp) / 1000);
      setResendError(`Too many attempts. Try again in ${timeLeft} seconds.`);
      setResendDisabled(true);
      setResendCooldown(timeLeft);
      return;
    }

    setLoadingResend(true);
    setError('');
    setResendMessage('');
    setResendError('');
    try {
      const response = await authAPI.resendVerificationCode(email);
      const attempts = (currentStatus?.attempts || 0) + 1;
      const newTimestamp = currentStatus?.timestamp || now;
      localStorage.setItem(LOCAL_STORAGE_RESEND_KEY, JSON.stringify({
        attempts: attempts,
        timestamp: newTimestamp
      }));
      setResendMessage(response.dataObject || 'A new verification code has been sent to your email.');
      if (attempts >= MAX_RESEND_ATTEMPTS) {
        setResendError(`Max resend attempts reached. Try again in ${RESEND_WINDOW_SECONDS} seconds.`);
        setResendDisabled(true);
        setResendCooldown(RESEND_WINDOW_SECONDS);
      }
    } catch (err) {
      console.error('Resend code API error:', err);
      setResendError(err.response?.data?.message || 'An error occurred while resending the code.');
    }
    setLoadingResend(false);
  };

  if (!email || !firstName) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Verification Error
          </Typography>
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            Your session information is missing. Please try signing up again.
          </Alert>
          <Button variant="contained" onClick={() => navigate('/signup')}>
            Go to Sign Up
          </Button>
        </Paper>
      </Container>
    );
  }

  if (showSuccessMessage) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Verification Successful!
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 1 }}>
            Welcome aboard, {firstName}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You have successfully activated your Dentabot account.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
          </Typography>
          <CircularProgress sx={{mt: 2}} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Verify Your Email, {firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          We've sent a 6-digit verification code to:
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 3, color: 'primary.dark', fontWeight: 'bold' }}>
          {email}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please enter the code below to activate your account.
        </Typography>

        <Box component="form" onSubmit={handleVerify} sx={{ width: '100%', maxWidth: '300px' }}>
          <TextField
            fullWidth
            id="verificationCode"
            name="verificationCode"
            label="Verification Code"
            variant="outlined"
            value={verificationCode}
            onChange={handleCodeChange}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
            error={!!error}
            helperText={error}
            disabled={loadingVerify || loadingResend}
            sx={{ mb: 2 }}
          />

          {resendMessage && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{resendMessage}</Alert>}
          {resendError && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{resendError}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loadingVerify || loadingResend || verificationCode.length !== 6}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loadingVerify ? <CircularProgress size={24} color="inherit" /> : 'Verify Account'}
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleResendCode}
            disabled={loadingVerify || loadingResend || resendDisabled}
          >
            {loadingResend ? <CircularProgress size={24} color="inherit" /> : 
             resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Verification Code'
            }
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
          If you don't see the email, please check your spam or junk folder.
        </Typography>
      </Paper>
    </Container>
  );
};

export default VerifyEmailWithCodePage;