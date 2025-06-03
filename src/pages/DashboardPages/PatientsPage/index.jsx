import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../../../context/auth';
import {
  SearchableList,
} from '../../../components/Dashboard/shared';
import api from '../../../services';

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
      if (!currentUser?.clinicId) {
        setError('No clinic information available for this user.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await api.clinic.getClinicPatientRecords(currentUser.clinicId);
        setPatients(data || []);
      } catch (err) {
        console.error('Failed to load patients:', err);
        setError('Failed to load patients. Please try again later.');
        // Return empty array on error instead of mock data
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, [currentUser?.clinicId]);

  /**
   * Render individual patient item
   */
  const renderPatientItem = (patient, index) => (
    <Box key={patient.id || index} sx={{ mb: 2 }}>
      <Box sx={{ fontWeight: 'medium', mb: 0.5 }}>
        {patient.name || patient.patientName || patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
      </Box>
      <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 0.5 }}>
        Phone: {patient.phone || patient.phoneNumber || 'N/A'}
      </Box>
      <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
        Email: {patient.email || patient.emailAddress || 'N/A'}
      </Box>
      {(patient.lastVisit || patient.nextAppointment) && (
        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', mt: 0.5 }}>
          {patient.lastVisit && `Last visit: ${patient.lastVisit}`}
          {patient.lastVisit && patient.nextAppointment && ' | '}
          {patient.nextAppointment && `Next: ${patient.nextAppointment}`}
        </Box>
      )}
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
        searchFields={['name', 'patientName', 'firstName', 'lastName', 'phone', 'phoneNumber', 'email', 'emailAddress']}
        emptyMessage="No patients found."
        searchPlaceholder="Search patients by name, phone, or email..."
      />
    </Box>
  );
};

export default PatientsPage;
