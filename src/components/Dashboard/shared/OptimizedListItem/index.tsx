import React, { memo, ReactNode } from 'react';
import {
  ListItem,
  ListItemSecondaryAction,
  Box,
  Chip,
} from '@mui/material';

interface OptimizedListItemProps {
  /** Primary text content */
  primary: ReactNode;
  /** Secondary text content */
  secondary?: ReactNode;
  /** Action component (button, etc.) */
  action?: ReactNode;
  /** Status text for chip */
  status?: string;
  /** Status chip color */
  statusColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /** Click handler */
  onClick?: () => void;
  /** Dense layout */
  dense?: boolean;
  /** Show divider */
  divider?: boolean;
  /** Additional props passed to ListItem */
  [key: string]: any;
}

/**
 * Optimized List Item Component
 * Memoized for performance with complex lists
 */
const OptimizedListItem = memo<OptimizedListItemProps>(({
  primary,
  secondary,
  action,
  status,
  statusColor = 'default',
  onClick,
  dense = false,
  divider = false,
  ...props
}) => {
  return (
    <ListItem
      component={onClick ? "button" : "li"}
      onClick={onClick}
      dense={dense}
      divider={divider}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        border: onClick ? 'none' : undefined,
        width: '100%',
        textAlign: 'left',
        backgroundColor: 'transparent',
        '&:hover': onClick ? {
          backgroundColor: 'action.hover'
        } : undefined,
        ...props.sx
      }}
      {...props}
    >
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: secondary || status ? 1 : 0 }}>
          {primary}
        </Box>
        {(secondary || status) && (
          <Box>
            {secondary && (
              <Box sx={{ mb: status ? 0.5 : 0, color: 'text.secondary', fontSize: '0.875rem' }}>
                {secondary}
              </Box>
            )}
            {status && (
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={status}
                  color={statusColor}
                  size="small"
                  variant="outlined"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      {action && (
        <ListItemSecondaryAction>
          {action}
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
});

OptimizedListItem.displayName = 'OptimizedListItem';

export default OptimizedListItem;
