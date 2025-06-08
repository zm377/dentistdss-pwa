import React from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';

interface LoadingStateProps {
  loading: boolean;
}

interface ErrorStateProps {
  error: string | null;
}

interface NoDataStateProps {
  dentistId?: string | number;
  availabilityCount: number;
  eventsCount: number;
}

/**
 * Loading state component
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      <CircularProgress />
    </Box>
  );
};

/**
 * Error state component
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
};

/**
 * No dentist selected state
 */
export const NoDentistState: React.FC<{ dentistId?: string | number }> = ({ dentistId }) => {
  if (dentistId) return null;
  
  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      Please select a dentist to view available time slots.
    </Alert>
  );
};

/**
 * Debug info and no data states
 */
export const NoDataState: React.FC<NoDataStateProps> = ({ 
  dentistId, 
  availabilityCount, 
  eventsCount 
}) => {
  if (!dentistId) return null;

  return (
    <>
      {/* Debug Info */}
      {availabilityCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Found {availabilityCount} availability slots, generated {eventsCount} time slots
        </Alert>
      )}

      {/* No events warning */}
      {eventsCount === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No available time slots found for the selected period.
          {availabilityCount > 0 
            ? ' Check console for debugging info.' 
            : ' Please try a different date or dentist.'
          }
        </Alert>
      )}
    </>
  );
};
