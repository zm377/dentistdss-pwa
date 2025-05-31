import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../../context/auth';
import {
  ListCard,
  ActionButton,
  InfoCard,
  SearchableList
} from '../../../components/Dashboard/shared';
import {
  mockPatientAppointmentsData,
  mockDentistAppointmentsData,
  mockReceptionistAppointmentsData,
  simulateApiCall
} from '../../../utils/dashboard/mockData';
import {
  formatDate,
  formatTime,
  getStatusColor
} from '../../../utils/dashboard/dashboardUtils';

/**
 * AppointmentsPage - Unified appointments page for all roles
 *
 * Features:
 * - Role-based appointment views
 * - Search and filter functionality
 * - Appointment management actions
 */
const AppointmentsPage = ({ userRole = 'PATIENT' }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser } = useAuth() || {};

  // Load appointments data
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      setError('');

      try {
        let mockData;
        switch (userRole) {
          case 'PATIENT':
            mockData = mockPatientAppointmentsData;
            break;
          case 'DENTIST':
            mockData = mockDentistAppointmentsData;
            break;
          case 'RECEPTIONIST':
            mockData = mockReceptionistAppointmentsData;
            break;
          default:
            mockData = mockPatientAppointmentsData;
        }
        const data = await simulateApiCall(mockData);
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [userRole]);

  /**
   * Render individual appointment item
   */
  const renderAppointmentItem = (appointment, index) => (
    <Box key={appointment.id || index} sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ fontWeight: 'medium', mb: 0.5 }}>
            {userRole === 'PATIENT' ? appointment.dentistName : appointment.patientName}
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 0.5 }}>
            {formatDate(appointment.date)} at {formatTime(appointment.time)}
          </Box>
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {appointment.type}
          </Box>
        </Box>
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'medium',
            backgroundColor: getStatusColor(appointment.status),
            color: 'white'
          }}
        >
          {appointment.status}
        </Box>
      </Box>
    </Box>
  );

  /**
   * Get role-specific content
   */
  const getRoleSpecificContent = () => {
    switch (userRole) {
      case 'PATIENT':
        return (
          <InfoCard
            elevation={2}
            cardSx={{ borderRadius: 2, overflow: 'hidden' }}
            contentSx={{ p: 3 }}
            showAlert={false}
          >
            <ActionButton
              component={RouterLink}
              to="/book-appointment"
              variant="contained"
              color="primary"
              size="large"
              position="left"
              containerSx={{ px: 3, py: 1 }}
            >
              Book New Appointment
            </ActionButton>

            <ListCard
              items={appointments}
              renderItem={renderAppointmentItem}
              emptyMessage="You have no upcoming appointments."
            />
          </InfoCard>
        );

      case 'DENTIST':
        return (
          <SearchableList
            items={appointments}
            renderItem={renderAppointmentItem}
            searchFields={['patientName', 'type']}
            emptyMessage="No appointments scheduled."
            searchPlaceholder="Search appointments by patient name or type..."
          />
        );

      case 'RECEPTIONIST':
        return (
          <Box>
            <ActionButton variant="contained" color="primary" position="left">
              Schedule New Appointment
            </ActionButton>
            <SearchableList
              items={appointments}
              renderItem={renderAppointmentItem}
              searchFields={['patientName', 'dentistName', 'type']}
              emptyMessage="No appointments found."
              searchPlaceholder="Search appointments by patient, dentist, or type..."
            />
          </Box>
        );

      default:
        return (
          <Alert severity="warning">
            Appointments view not available for this role.
          </Alert>
        );
    }
  };

  if (loading) {
    return <Alert severity="info">Loading appointments...</Alert>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      {getRoleSpecificContent()}
    </Box>
  );
};

AppointmentsPage.propTypes = {
  /** User role to determine view type */
  userRole: PropTypes.oneOf(['PATIENT', 'DENTIST', 'RECEPTIONIST']),
};

export default AppointmentsPage;
