import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import ChatInterface from '../pages/ChatBotDentist';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Welcome from '../pages/Welcome';
import Book from '../pages/Book';
import Learn from '../pages/Learn';
import ClinicStaffSignup from '../pages/ClinicStaffSignup';
import VerifyEmailPendingPage from '../pages/VerifyEmailWithCodePage';
import VerifyEmailPage from '../pages/VerifyEmailWithTokenPage';
import DashboardPage from '../pages/DashboardPage';
import QuizPage from '../pages/Quiz';
import FindAClinic from '../pages/FindAClinic';
import ClinicAdminSignup from '../pages/ClinicAdminSignup';
import { useAuth } from '../context/AuthContext';
import config from '../config';
import TermsAndConditions from '../pages/TermsAndConditions';

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
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Welcome />}
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
        path="/quiz"
        element={<QuizPage />}
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
              <ChatInterface />
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route 
        path="/pending-approval"
        element={<Typography variant="h5" align="center" sx={{mt: 4}}>Your account is pending approval. Please check your email or contact support.</Typography>}
      />
      <Route
        path="/find-a-clinic"
        element={<FindAClinic />}
      />
      <Route 
        path="/signup/clinic-admin" 
        element={!isAuthenticated ? <ClinicAdminSignup /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/terms" 
        element={<TermsAndConditions />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes; 