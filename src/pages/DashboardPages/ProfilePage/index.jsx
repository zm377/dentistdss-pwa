import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import {
  mockDentistProfileData,
  simulateApiCall
} from '../../../utils/dashboard/mockData';

/**
 * ProfilePage - Profile page for dentists
 * 
 * Features:
 * - Dentist profile information
 * - Professional details
 * - Specializations and credentials
 */
const ProfilePage = () => {
  const [dentistProfile, setDentistProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load dentist profile data
  useEffect(() => {
    const loadDentistProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await simulateApiCall(mockDentistProfileData);
        setDentistProfile(data);
      } catch (err) {
        console.error('Failed to load dentist profile:', err);
        setError('Failed to load profile information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadDentistProfile();
  }, []);

  if (loading) {
    return <Alert severity="info">Loading profile...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            My Profile
          </Typography>
          {dentistProfile ? (
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Name"
                  secondary={dentistProfile.name}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Specialization"
                  secondary={dentistProfile.specialization}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="License Number"
                  secondary={dentistProfile.licenseNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Years of Experience"
                  secondary={`${dentistProfile.experience} years`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Education"
                  secondary={dentistProfile.education}
                />
              </ListItem>
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Profile information not available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

ProfilePage.propTypes = {
  // No additional props needed
};

export default ProfilePage;
