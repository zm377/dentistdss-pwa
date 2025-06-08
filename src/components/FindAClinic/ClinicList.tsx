import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Divider,
  CircularProgress,
  List,
} from '@mui/material';
import ClinicCard from './ClinicCard';
import type { ClinicSearchResult } from '../../types/api';

interface ClinicListProps {
  clinics: ClinicSearchResult[];
  selectedClinic?: ClinicSearchResult | null;
  loading: boolean;
  isMobile: boolean;
  onClinicSelect: (clinic: ClinicSearchResult) => void;
}

/**
 * ClinicList Component
 *
 * Responsive list of clinic search results with:
 * - Mobile-first responsive design
 * - Loading and empty states
 * - Accessible list structure
 * - Optimized scrolling for mobile
 */
const ClinicList = React.memo<ClinicListProps>(({
  clinics,
  selectedClinic,
  loading,
  isMobile,
  onClinicSelect
}) => {

  // Responsive list height
  const getListHeight = (): string => {
    if (isMobile) return 'auto';
    return '600px';
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: getListHeight(),
        overflow: isMobile ? 'visible' : 'auto',
        borderRadius: 2,
        width: '100%', // Ensure full width within Grid item
        minWidth: '100%', // Prevent width collapse
        maxWidth: '100%', // Prevent overflow
        display: 'block',
        boxSizing: 'border-box',
        flex: '1 1 auto',
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Header */}
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            fontWeight: 600,
          }}
        >
          Search Results ({clinics.length})
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: { xs: 3, sm: 4 },
              minHeight: { xs: 120, sm: 160 },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={isMobile ? 32 : 40} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Searching for clinics...
              </Typography>
            </Box>
          </Box>
        ) : clinics.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              py: { xs: 3, sm: 4 },
              textAlign: 'center',
              minHeight: { xs: 120, sm: 160 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                No clinics found
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                Try searching with different keywords or check your spelling.
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Clinic List */
          <List
            sx={{
              width: '100%',
              p: 0,
              '& .MuiListItem-root': {
                p: 0,
              }
            }}
            role="list"
            aria-label="Clinic search results"
          >
            {clinics.map((clinic, index) => (
              <ClinicCard
                key={clinic.id || index}
                clinic={clinic}
                isSelected={selectedClinic?.id === clinic.id}
                onClick={() => onClinicSelect(clinic)}
                isMobile={isMobile}
                isLast={index === clinics.length - 1}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
});

ClinicList.displayName = 'ClinicList';

export default ClinicList;
