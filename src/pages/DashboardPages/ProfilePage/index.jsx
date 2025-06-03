import React, { useState, useEffect } from 'react';
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
import api from '../../../services';

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
      if (!currentUser?.id) {
        setError('No user information available.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await api.user.getProfile(currentUser.id);
        setDentistProfile(data || null);
      } catch (err) {
        console.error('Failed to load dentist profile:', err);
        setError('Failed to load profile information. Please try again later.');
        setDentistProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadDentistProfile();
  }, [currentUser?.id]);

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
                  secondary={dentistProfile.name || (dentistProfile.firstName && dentistProfile.lastName ? `${dentistProfile.firstName} ${dentistProfile.lastName}` : 'N/A')}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Email"
                  secondary={dentistProfile.email || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Role"
                  secondary={dentistProfile.role || 'N/A'}
                />
              </ListItem>
              {dentistProfile.specialization && (
                <ListItem>
                  <ListItemText
                    primary="Specialization"
                    secondary={dentistProfile.specialization}
                  />
                </ListItem>
              )}
              {dentistProfile.licenseNumber && (
                <ListItem>
                  <ListItemText
                    primary="License Number"
                    secondary={dentistProfile.licenseNumber}
                  />
                </ListItem>
              )}
              {dentistProfile.experience && (
                <ListItem>
                  <ListItemText
                    primary="Years of Experience"
                    secondary={`${dentistProfile.experience} years`}
                  />
                </ListItem>
              )}
              {dentistProfile.education && (
                <ListItem>
                  <ListItemText
                    primary="Education"
                    secondary={dentistProfile.education}
                  />
                </ListItem>
              )}
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

export default ProfilePage;
