import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { getResponsivePadding } from '../../../../utils/mobileOptimization';

/**
 * InfoCard - A card component for displaying informational content
 * 
 * Features:
 * - Consistent styling for info/placeholder content
 * - Support for different alert severities
 * - Flexible content rendering
 * - Proper spacing and elevation
 */
const InfoCard = ({
  title,
  message,
  severity = 'info',
  elevation = 2,
  showAlert = true,
  children,
  cardSx = {},
  contentSx = {},
  ...otherProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Card
        elevation={elevation}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            boxShadow: theme.shadows[elevation + 2],
            transform: 'translateY(-1px)',
          },
          ...cardSx
        }}
        {...otherProps}
      >
        <CardContent sx={{
          p: getResponsivePadding('medium'),
          '&:last-child': {
            pb: getResponsivePadding('medium').xs
          },
          ...contentSx
        }}>
          {title && (
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                mb: { xs: 1.5, sm: 2 }
              }}
            >
              {title}
            </Typography>
          )}

          {message && (
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                lineHeight: { xs: 1.5, sm: 1.6 },
                mb: children || showAlert ? { xs: 2, sm: 3 } : 0
              }}
            >
              {message}
            </Typography>
          )}

          {children}

          {showAlert && (
            <Alert
              severity={severity}
              sx={{
                mt: { xs: 1.5, sm: 2 },
                p: getResponsivePadding('small'),
                borderRadius: 1,
                '& .MuiAlert-message': {
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
              >
                This feature is currently under development and will be available soon.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

InfoCard.propTypes = {
  /** Card title */
  title: PropTypes.string,
  /** Main message content */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Alert severity for development notice */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  /** Card elevation */
  elevation: PropTypes.number,
  /** Whether to show development alert */
  showAlert: PropTypes.bool,
  /** Additional content */
  children: PropTypes.node,
  /** Custom card styles */
  cardSx: PropTypes.object,
  /** Custom content styles */
  contentSx: PropTypes.object,
};

export default InfoCard;
