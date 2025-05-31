import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
} from '@mui/material';

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
  return (
    <Box>
      <Card 
        elevation={elevation} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          ...cardSx 
        }}
        {...otherProps}
      >
        <CardContent sx={{ p: 3, ...contentSx }}>
          {title && (
            <Typography variant="h6" component="h2" gutterBottom>
              {title}
            </Typography>
          )}
          
          {message && (
            <Typography 
              variant="body1" 
              sx={{ fontSize: '1.1rem', mb: children || showAlert ? 3 : 0 }}
            >
              {message}
            </Typography>
          )}
          
          {children}
          
          {showAlert && (
            <Alert severity={severity} sx={{ mt: 2, p: 2 }}>
              <Typography variant="body1">
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
