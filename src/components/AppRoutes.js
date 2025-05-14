import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import ChatInterface from './ChatInterface';
import Login from './Login';
import Signup from './Signup';
import Welcome from './Welcome';
import Book from './Book';
import Learn from './Learn';
import ClinicStaffSignup from './ClinicStaffSignup';
import VerifyEmailPendingPage from '../pages/VerifyEmailPendingPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import DashboardPage from '../pages/DashboardPage';
import { useAuth } from '../context/AuthContext';
import config from '../config';

function AppRoutes() {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />}
      />
      <Route 
        path="/clinic-staff-signup"
        element={!isAuthenticated ? <ClinicStaffSignup /> : <Navigate to="/dashboard" replace />}
      />
      <Route 
        path="/verify-email-pending"
        element={<VerifyEmailPendingPage />}
      />
      <Route 
        path="/signup/verify" 
        element={<VerifyEmailPage />}
      />
      <Route
        path="/"
        element={<Welcome />}
      />
      <Route
        path="/book"
        element={<Book />}
      />
      <Route
        path="/learn"
        element={<Learn />}
      />
      <Route
        path="/chat"
        element={
          isAuthenticated ? (
            <>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                  mb: { xs: 2, sm: 3, md: 4 },
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
                }}
              >
                {config.app.name} - Your Dental Assistant
              </Typography>
              <ChatInterface apiKeyProp={config.chatbot.apiKey} />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            currentUser && currentUser.roles && currentUser.roles.length > 0 && currentUser.approvalStatus === 'approved' ? 
              <DashboardPage /> : 
              (currentUser && currentUser.approvalStatus === 'pending' ? 
                <Navigate to="/pending-approval" replace /> :
                <Navigate to="/login" replace />
              )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route 
        path="/pending-approval"
        element={<Typography variant="h5" align="center" sx={{mt: 4}}>Your account is pending approval. Please check your email or contact support.</Typography>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes; 