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
  mockDentistPatientRecordsData,
  simulateApiCall
} from '../../../utils/dashboard/mockData';

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
      setLoading(true);
      setError('');

      try {
        const data = await simulateApiCall(mockDentistPatientRecordsData);
        setPatientRecords(data);
      } catch (err) {
        console.error('Failed to load patient records:', err);
        setError('Failed to load patient records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPatientRecords();
  }, []);

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
                    primary={record.patientName}
                    secondary={`Last visit: ${record.lastVisit} | Treatment: ${record.treatment}`}
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

PatientRecordsPage.propTypes = {
  // No additional props needed
};

export default PatientRecordsPage;
