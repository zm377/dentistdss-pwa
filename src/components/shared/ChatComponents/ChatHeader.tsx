import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

interface ChatHeaderProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  onClear?: () => void;
  showClearButton?: boolean;
  additionalActions?: ReactNode;
  isMobile?: boolean;
}

/**
 * Reusable chat header component
 */
const ChatHeader: React.FC<ChatHeaderProps> = ({
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

export default ChatHeader;
