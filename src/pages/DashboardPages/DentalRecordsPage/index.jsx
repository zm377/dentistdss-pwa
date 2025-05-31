import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { InfoCard } from '../../../components/Dashboard/shared';

/**
 * DentalRecordsPage - Dental records page for patients
 * 
 * Features:
 * - Patient dental records access
 * - Treatment history
 * - X-rays and notes (placeholder)
 */
const DentalRecordsPage = () => {
  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <InfoCard
        title="Dental Records"
        message="Your dental records, including treatment history, X-rays, and notes from your dentist, will be accessible here."
        severity="info"
        elevation={2}
      />
    </Box>
  );
};

DentalRecordsPage.propTypes = {
  // No additional props needed
};

export default DentalRecordsPage;
