import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
} from '@mui/material';
import MessagePanel from '../../../MessagePanel';

/**
 * MessageSection - A wrapper component for the MessagePanel
 * 
 * Features:
 * - Consistent card styling across dashboard
 * - Proper spacing and layout
 * - Reusable across different role dashboards
 */
const MessageSection = ({ 
  userId,
  cardSx = {},
  ...otherProps 
}) => {
  return (
    <Box>
      <Card 
        sx={{ 
          width: '100%',
          ...cardSx 
        }}
        {...otherProps}
      >
        <CardContent>
          <MessagePanel userId={userId} />
        </CardContent>
      </Card>
    </Box>
  );
};

MessageSection.propTypes = {
  /** User ID for message filtering */
  userId: PropTypes.string.isRequired,
  /** Custom styles for the card */
  cardSx: PropTypes.object,
};

export default MessageSection;
