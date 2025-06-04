import PropTypes from 'prop-types';
import {
  Box,
  Typography,
} from '@mui/material';

/**
 * Reusable chat header component
 */
const ChatHeader = ({ 
  subtitle, 
}) => {
  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
      
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
