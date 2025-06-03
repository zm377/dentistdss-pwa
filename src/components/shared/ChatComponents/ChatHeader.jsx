import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

/**
 * Reusable chat header component
 */
const ChatHeader = ({ 
  icon, 
  title, 
  subtitle, 
  onClear, 
  showClearButton = true,
  additionalActions = null 
}) => {
  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h6">
            {title}
          </Typography>
          <Chip
            label="Online"
            color="success"
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {additionalActions}
          {showClearButton && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={onClear}
            >
              Clear Chat
            </Button>
          )}
        </Box>
      </Box>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

ChatHeader.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onClear: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool,
  additionalActions: PropTypes.node,
};

export default ChatHeader;
