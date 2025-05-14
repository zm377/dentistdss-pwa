import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Container, Paper, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const VerifyEmailPendingPage = () => {
  const location = useLocation();
  const { email, firstName } = location.state || {};

  if (!email || !firstName) {
    // Fallback if state is not passed correctly, though ideally this shouldn't happen
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Verify Your Email
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Information missing. Please try signing up again.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Almost there, {firstName}!
        </Typography>
        <Typography variant="h6" component="p" sx={{ mb: 1 }}>
          Please check your email inbox for a message from us.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We've sent a verification link to <strong style={{ color: 'primary.dark' }}>{email}</strong>.
          Click the link in the email to complete your registration and activate your account.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Didn't receive the email? Please check your spam or junk folder, or try signing up again after a few minutes.
        </Typography>
      </Paper>
    </Container>
  );
};

export default VerifyEmailPendingPage;