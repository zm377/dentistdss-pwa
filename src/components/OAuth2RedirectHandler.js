import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

const OAuth2RedirectHandler = () => {
  const { handleOauthRedirect, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OAuth2RedirectHandler mounted, calling handleOauthRedirect...");
    handleOauthRedirect().catch(error => {
      console.error("Error in handleOauthRedirect from OAuth2RedirectHandler:", error);
      navigate('/login', { state: { error: 'An unexpected error occurred during OAuth processing.' } });
    });
  }, [handleOauthRedirect, navigate]);

  if (loading) {
    return (
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Processing authentication...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
        <Typography variant="h5" gutterBottom>OAuth Redirect</Typography>
        <Typography variant="body1">
            If you are not redirected, please try logging in again.
        </Typography>
    </Container>
  );
};

export default OAuth2RedirectHandler; 