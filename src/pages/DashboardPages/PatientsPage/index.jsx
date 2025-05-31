import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import {
  SearchableList,
} from '../../../components/Dashboard/shared';
import {
  mockReceptionistPatientsData,
  simulateApiCall
} from '../../../utils/dashboard/mockData';

/**
 * PatientsPage - Patients management page for receptionists
 *
 * Features:
 * - Patient list with search
 * - Patient information access
 * - Contact management
 */
const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load patients data
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await simulateApiCall(mockReceptionistPatientsData);
        setPatients(data);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setError('Failed to load patients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  /**
   * Render individual patient item
   */
  const renderPatientItem = (patient, index) => (
    <Box key={patient.id || index} sx={{ mb: 2 }}>
      <Box sx={{ fontWeight: 'medium', mb: 0.5 }}>
        {patient.name}
      </Box>
      <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 0.5 }}>
        Phone: {patient.phone}
      </Box>
      <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
        Email: {patient.email}
      </Box>
    </Box>
  );

  if (loading) {
    return <Alert severity="info">Loading patients...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <SearchableList
        items={patients}
        renderItem={renderPatientItem}
        searchFields={['name', 'phone', 'email']}
        emptyMessage="No patients found."
        searchPlaceholder="Search patients by name, phone, or email..."
      />
    </Box>
  );
};

PatientsPage.propTypes = {
  // No additional props needed
};

export default PatientsPage;
