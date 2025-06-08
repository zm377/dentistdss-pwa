import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Fade,
} from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
}

/**
 * LoadingOverlay Component
 *
 * Global loading overlay with:
 * - Smooth fade transitions
 * - Accessible loading states
 * - Responsive design
 * - Screen reader support
 */
const LoadingOverlay = React.memo<LoadingOverlayProps>(({ loading, message = '' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
      }}
      open={loading}
      aria-hidden={!loading}
    >
      <Fade in={loading} timeout={300}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
          role="status"
          aria-live="polite"
          aria-label={message || 'Loading'}
        >
          <CircularProgress
            color="inherit"
            size={48}
            thickness={4}
          />
          
          {message && (
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Fade>
    </Backdrop>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
