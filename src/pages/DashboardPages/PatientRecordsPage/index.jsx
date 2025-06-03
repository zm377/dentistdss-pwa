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
 * PatientRecordsPage - Patient records page for dentists
 *
 * Features:
 * - Access to patient records
 * - Treatment history
 * - Medical notes and files
 */
const PatientRecordsPage = () => {
  const [patientRecords, setPatientRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load patient records data
  useEffect(() => {
    const loadPatientRecords = async () => {
      if (!currentUser?.id) {
        setError('No user information available.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await api.clinic.getDentistPatientRecords(currentUser.id);
        setPatientRecords(data || []);
      } catch (err) {
        console.error('Failed to load patient records:', err);
        setError('Failed to load patient records. Please try again later.');
        // Return empty array on error instead of mock data
        setPatientRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatientRecords();
  }, [currentUser?.id]);

  if (loading) {
    return <Alert severity="info">Loading patient records...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Patient Records
          </Typography>
          {patientRecords.length > 0 ? (
            <List dense>
              {patientRecords.map((record, index) => (
                <ListItem key={record.id || index}>
                  <ListItemText
                    primary={record.patientName || record.name || 'Unknown Patient'}
                    secondary={`Last visit: ${record.lastVisit || 'N/A'} | Notes: ${record.treatment || record.notes || 'No notes available'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No patient records available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientRecordsPage;
