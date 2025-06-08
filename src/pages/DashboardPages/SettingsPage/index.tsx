import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useAuth } from '../../../context/auth';
import {
  getResponsivePadding,
  getResponsiveMargin
} from '../../../utils/mobileOptimization';
import api from '../../../services';
import SystemSettingsSection from './components/SystemSettingsSection';
import ClinicInformationForm from './components/ClinicInformationForm';
import { UserRole, Clinic } from '../../../types';

interface SettingsPageProps {
  userRole?: UserRole;
}

/**
 * SettingsPage - Unified settings page for admin roles
 *
 * Features:
 * - Clinic settings for Clinic Admin
 * - System settings for System Admin
 * - Role-specific configuration options
 * - Responsive design with mobile optimization
 */
const SettingsPage: React.FC<SettingsPageProps> = ({ userRole = 'CLINIC_ADMIN' }) => {
  const [clinicDetails, setClinicDetails] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { currentUser } = useAuth() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
   * Handle clinic data update
   */
  const handleClinicUpdate = (updatedClinic: Clinic) => {
    setClinicDetails(updatedClinic);
  };

  /**
   * Render clinic admin settings
   */
  const renderClinicSettings = () => (
    <ClinicInformationForm
      clinicData={clinicDetails || undefined}
      onUpdate={handleClinicUpdate}
    />
  );

  /**
   * Render system admin settings
   */
  const renderSystemSettings = () => (
    <SystemSettingsSection />
  );

  if (loading) {
    return (
      <Box sx={{ p: getResponsivePadding('medium') }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: { xs: 200, sm: 400 },
            flexDirection: 'column',
            gap: { xs: 1, sm: 2 }
          }}
        >
          <CircularProgress size={isMobile ? 32 : 40} />
          <Alert
            severity="info"
            sx={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              '& .MuiAlert-message': {
                fontSize: 'inherit'
              }
            }}
          >
            Loading settings...
          </Alert>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: getResponsivePadding('medium') }}>
        <Alert
          severity="error"
          sx={{
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            '& .MuiAlert-message': {
              fontSize: 'inherit'
            }
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: getResponsivePadding('medium'),
      height: '100%',
      maxWidth: { xs: '100%', sm: '100%', md: '100%' }
    }}>
      {/* Page Title */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          mb: getResponsiveMargin('medium'),
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 }
        }}
      >
        <SettingsIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
        {userRole === 'CLINIC_ADMIN' ? 'Clinic Settings' : 'System Settings'}
      </Typography>

      {/* Settings Content */}
      <Box sx={{
        height: 'calc(100% - 80px)',
        '& .MuiCard-root': {
          borderRadius: { xs: 1, sm: 2 }
        },
        '& .MuiTextField-root': {
          '& .MuiInputBase-input': {
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }
        }
      }}>
        {userRole === 'CLINIC_ADMIN' && renderClinicSettings()}
        {userRole === 'SYSTEM_ADMIN' && renderSystemSettings()}
        {!['CLINIC_ADMIN', 'SYSTEM_ADMIN'].includes(userRole) && (
          <Alert
            severity="warning"
            sx={{
              fontSize: { xs: '0.85rem', sm: '0.9rem' },
              '& .MuiAlert-message': {
                fontSize: 'inherit'
              }
            }}
          >
            Settings not available for this role.
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SettingsPage;
