import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import api from '../../../services';
import SystemSettingsSection from './components/SystemSettingsSection';

/**
 * SettingsPage - Unified settings page for admin roles
 * 
 * Features:
 * - Clinic settings for Clinic Admin
 * - System settings for System Admin
 * - Role-specific configuration options
 */
const SettingsPage = ({ userRole = 'CLINIC_ADMIN' }) => {
  const [clinicDetails, setClinicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load settings data
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError('');

      try {
        if (userRole === 'CLINIC_ADMIN') {
          if (!currentUser?.clinicId) {
            setError('No clinic information available for this user.');
            setLoading(false);
            return;
          }
          const data = await api.clinic.getClinicById(currentUser.clinicId);
          setClinicDetails(data);
        }
        // System admin settings would be loaded here
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userRole, currentUser?.clinicId]);

  /**
   * Render clinic admin settings
   */
  const renderClinicSettings = () => (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Clinic Information
            </Typography>
            <TextField
              label="Clinic Name"
              defaultValue={clinicDetails?.name}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Address"
              defaultValue={clinicDetails?.address}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
            />
            <TextField
              label="Phone Number"
              defaultValue={clinicDetails?.phone}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Email"
              defaultValue={clinicDetails?.email}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  /**
   * Render system admin settings
   */
  const renderSystemSettings = () => (
    <SystemSettingsSection />
  );

  if (loading) {
    return <Alert severity="info">Loading settings...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      {userRole === 'CLINIC_ADMIN' && renderClinicSettings()}
      {userRole === 'SYSTEM_ADMIN' && renderSystemSettings()}
      {!['CLINIC_ADMIN', 'SYSTEM_ADMIN'].includes(userRole) && (
        <Alert severity="warning">
          Settings not available for this role.
        </Alert>
      )}
    </Box>
  );
};

SettingsPage.propTypes = {
  /** User role to determine settings type */
  userRole: PropTypes.oneOf(['CLINIC_ADMIN', 'SYSTEM_ADMIN']),
};

export default SettingsPage;
