import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

/**
 * Reusable chat input component with quick action buttons
 */
const ChatInput = ({ 
  value,
  onChange,
  onSend,
  onKeyPress,
  placeholder,
  isLoading,
  quickActions = [],
  maxRows = 4 
}) => {
  return (
    <>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={maxRows}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            sx={{ mb: 0.5 }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
        
        {/* Quick action buttons */}
        {quickActions.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="small"
                variant="outlined"
                onClick={() => action.onClick()}
                disabled={isLoading}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  quickActions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })),
  maxRows: PropTypes.number,
};

export default ChatInput;
