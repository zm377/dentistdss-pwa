import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import api from '../../../services';

/**
 * OverviewPage - Dashboard overview page for Clinic Admin
 * 
 * Features:
 * - Clinic welcome message
 * - Quick stats and information
 * - Dashboard summary
 */
const OverviewPage = () => {
  const [clinicDetails, setClinicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load clinic data
  useEffect(() => {
    const loadClinicData = async () => {
      if (!currentUser?.clinicId) {
        setError('No clinic information available for this user.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await api.clinic.getClinicById(currentUser.clinicId);
        setClinicDetails(data);
      } catch (err) {
        console.error('Failed to load clinic data:', err);
        setError('Failed to load clinic information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadClinicData();
  }, [currentUser?.clinicId]);

  if (loading) {
    return <Alert severity="info">Loading clinic information...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Welcome to {clinicDetails?.name || 'Your Clinic'}
          </Typography>
          <Typography variant="body1">
            Manage your clinic operations from this dashboard.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OverviewPage;
