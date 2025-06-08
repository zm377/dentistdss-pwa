import React from 'react';
import {
  Box,
  Card,
  CardContent,
  SxProps,
  Theme,
} from '@mui/material';
import MessagePanel from '../../../MessagePanel';

interface MessageSectionProps {
  /** User ID for message filtering */
  userId: string | number;
  /** Custom styles for the card */
  cardSx?: SxProps<Theme>;
  /** Additional props passed to Card component */
  [key: string]: any;
}

/**
 * MessageSection - A wrapper component for the MessagePanel
 *
 * Features:
 * - Consistent card styling across dashboard
 * - Proper spacing and layout
 * - Reusable across different role dashboards
 */
const MessageSection: React.FC<MessageSectionProps> = ({
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
          <MessagePanel userId={Number(userId)} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default MessageSection;
